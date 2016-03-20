%%--------------------------------------------------------------------
%% Copyright (c) 2015-2016 Feng Lee <feng@emqtt.io>.
%%
%% Licensed under the Apache License, Version 2.0 (the "License");
%% you may not use this file except in compliance with the License.
%% You may obtain a copy of the License at
%%
%%     http://www.apache.org/licenses/LICENSE-2.0
%%
%% Unless required by applicable law or agreed to in writing, software
%% distributed under the License is distributed on an "AS IS" BASIS,
%% WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
%% See the License for the specific language governing permissions and
%% limitations under the License.
%%--------------------------------------------------------------------

-module(emqttd_dashboard).

-import(proplists, [get_value/2]).

-export([http_handler/0, handle_request/2, query_table/5]).

-export([strftime/1]).

-define(APP, ?MODULE).

-record(state, {docroot, dispatch}).

%%--------------------------------------------------------------------
%% HTTP Handler and Dispatcher
%%--------------------------------------------------------------------

http_handler() ->
    {ok, Modules} = application:get_key(?APP, modules),
    APIs = lists:append(lists:map(fun http_api/1, Modules)),
    State = #state{docroot  = docroot(), dispatch = dispatcher(APIs)},
    {?MODULE, handle_request, [State]}.

http_api(Mod) ->
    [{Name, {Mod, Fun, Args}} || {http_api, [{Name, Fun, Args}]} <- Mod:module_info(attributes)].

docroot() ->
    {file, Here} = code:is_loaded(?MODULE),
    Dir = filename:dirname(filename:dirname(Here)),
    filename:join([Dir, "priv", "www"]).

dispatcher(APIs) ->
    fun(Req, Name, Params) ->
        case get_value(Name, APIs) of
            {Mod, Fun, ArgDefs} ->
                io:format("Handle ~s API: ~s:~s~n", [Name, Mod, Fun]),
                Args = lists:map(fun(Def) -> parse_arg(Def, Params) end, ArgDefs),
                case catch apply(Mod, Fun, Args) of
                    {ok, Data} ->
                        respond(Req, 200, Data);
                    {'EXIT', Reason} ->
                        lager:error("Execute API '~s' Error: ~p", [Name, Reason]),
                        respond(Req, 404, [])
                end;
            undefined ->
                respond(Req, 404, [])
        end
    end.

parse_arg({Arg, Type}, Params) ->
    parse_arg({Arg, Type, undefined}, Params);
parse_arg({Arg, Type, Def}, Params) ->
    case get_value(Arg, Params) of
        undefined -> Def;
        Val       -> format(Type, Val)
    end.

respond(Req, 401, Data) ->
    Req:respond({401, [{"WWW-Authenticate", "Basic Realm=\"emqttd dashboard\""}], Data});
respond(Req, 404, Data) ->
    Req:respond({404, [{"Content-Type", "text/plain"}], Data});
respond(Req, 200, Data) ->
    Req:respond({200, [{"Content-Type", "application/json"}], to_json(Data)});
respond(Req, Code, Data) ->
    Req:respond({Code, [{"Content-Type", "text/plain"}], Data}).

%%--------------------------------------------------------------------
%% Handle HTTP Request
%%--------------------------------------------------------------------

handle_request(Req, State) ->
    if_authorized(Req, fun() -> Path = Req:get(path), handle_request(Path, Req, State) end).

handle_request("/api/current_user", Req, _State) ->
    "Basic " ++ BasicAuth =  Req:get_header_value("Authorization"),
    {Username, _Password} = user_passwd(BasicAuth),
    respond(Req, 200, [{username, bin(Username)}]);

handle_request("/api/logout", Req, _State) ->
    respond(Req, 401, []);

handle_request("/api/" ++ Name, Req, #state{dispatch = Dispatch}) ->
    Dispatch(Req, Name, Req:parse_post());

handle_request("/" ++ Rest, Req, #state{docroot = DocRoot}) ->
    mochiweb_request:serve_file(Rest, DocRoot, Req).

%%--------------------------------------------------------------------
%% Table Query and Pagination
%%--------------------------------------------------------------------

query_table(Qh, PageNo, PageSize, TotalNum, RowFun) ->
    Cursor = qlc:cursor(Qh),
    case PageNo > 1 of
        true  -> qlc:next_answers(Cursor, (PageNo - 1) * PageSize);
        false -> ok
    end,
    TotalPage = case TotalNum rem PageSize of
                    0 -> TotalNum div PageSize;
                    _ -> (TotalNum div PageSize) + 1
                end,
    Rows = qlc:next_answers(Cursor, PageSize),
    {ok, [{currentPage, PageNo}, {pageSize, PageSize},
          {totalNum, TotalNum}, {totalPage, TotalPage},
          {result, [RowFun(Row) || Row <- Rows]}]}.

%%--------------------------------------------------------------------
%% Strftime
%%--------------------------------------------------------------------

strftime({MegaSecs, Secs, _MicroSecs}) ->
    strftime(datetime(MegaSecs * 1000000 + Secs));

strftime({{Y,M,D}, {H,MM,S}}) ->
    lists:flatten(
        io_lib:format(
            "~4..0w-~2..0w-~2..0w ~2..0w:~2..0w:~2..0w", [Y, M, D, H, MM, S])).

datetime(Timestamp) when is_integer(Timestamp) ->
    Universal = calendar:gregorian_seconds_to_datetime(Timestamp +
    calendar:datetime_to_gregorian_seconds({{1970,1,1}, {0,0,0}})),
    calendar:universal_time_to_local_time(Universal).

%%--------------------------------------------------------------------
%% Basic Authorization
%%--------------------------------------------------------------------

if_authorized(Req, Fun) ->
    case authorized(Req) of
        true  -> Fun();
        false -> respond(Req, 401,  [])
    end.

authorized(Req) ->
    case Req:get_header_value("Authorization") of
        undefined             ->
            false;
        "Basic " ++ BasicAuth ->
            {Username, Password} = user_passwd(BasicAuth),
            case emqttd_dashboard_admin:check(bin(Username), bin(Password)) of
                ok -> true;
                {error, Reason} ->
                    lager:error("HTTP Auth failure: username=~s, reason=~p",
                                [Username, Reason]),
                    false
            end
    end.

user_passwd(BasicAuth) ->
    list_to_tuple(binary:split(base64:decode(BasicAuth), <<":">>)).

to_json([])   -> <<"[]">>;
to_json(Data) -> iolist_to_binary(mochijson2:encode(Data)).

format(string, S) -> S;
format(binary, S) -> list_to_binary(S);
format(int, S)    -> list_to_integer(S).

bin(S) when is_list(S)   -> list_to_binary(S);
bin(A) when is_atom(A)   -> bin(atom_to_list(A));
bin(B) when is_binary(B) -> B.

