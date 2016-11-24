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

%% @doc Web dashboard admin authentication with username and password.
-module(emq_dashboard_admin).

-behaviour(gen_server).

-include("emq_dashboard.hrl").

%% Mnesia Callbacks
-export([mnesia/1]).
%%
-boot_mnesia({mnesia, [boot]}).
-copy_mnesia({mnesia, [copy]}).
%%
%% API Function Exports
-export([start_link/0]).

%%mqtt_admin api
-export([add_user/3, remove_user/1, update_user/3, lookup_user/1, change_password/2, 
         all_users/0, check/2]).

%% gen_server Function Exports
-export([init/1, handle_call/3, handle_cast/2, handle_info/2,
         terminate/2, code_change/3]).


mnesia(boot) ->
    emqttd_mnesia:create_table(mqtt_admin, [
                {type, set},
                {disc_copies, [node()]},
                {local_content, true},
                {record_name, mqtt_admin},
                {attributes, record_info(fields, mqtt_admin)}]);
mnesia(copy) ->
    emqttd_mnesia:copy_table(mqtt_admin),
    mnesia:change_table_copy_type(mqtt_admin, node(), disc_copies).


-spec(start_link() -> {ok, pid()} | ignore | {error, any()}).
start_link() ->
    gen_server:start_link({local, ?MODULE}, ?MODULE, [], []).

%%--------------------------------------------------------------------
%% API
%%--------------------------------------------------------------------

-spec(add_user(binary(), binary(), binary()) -> ok | {error, any()}).
add_user(Username, Password, Tags) when is_binary(Username), is_binary(Password) ->
    Admin = #mqtt_admin{username = Username, password = hash(Password), tags = Tags},
    return(mnesia:transaction(fun add_user_/1, [Admin])).

%% @private
add_user_(Admin = #mqtt_admin{username = Username}) ->
    case mnesia:wread({mqtt_admin, Username}) of
        []  -> mnesia:write(Admin);
        [_] -> mnesia:abort("username already exist")
    end.

-spec(remove_user(binary()) -> ok | {error, any()}).
remove_user(Username) when is_binary(Username) ->
    Trans = fun() ->
                    case lookup_user(Username) of
                    [] ->
                        mnesia:abort("Username Not Found");
                    _  -> ok
                    end,
                    mnesia:delete({mqtt_admin, Username})
            end,
    return(mnesia:transaction(Trans)).

-spec(update_user(binary(), binary(), binary()) -> ok | {error, any()}).
update_user(Username, Password, Tags) when is_binary(Username), is_binary(Password) ->
    Admin = #mqtt_admin{username = Username, password = hash(Password), tags = Tags},
    return(mnesia:transaction(fun update_user_/1, [Admin])).

%% @private
update_user_(Admin = #mqtt_admin{username = Username}) ->
    case mnesia:wread({mqtt_admin, Username}) of
        []  -> mnesia:abort("username not found");
        [_] -> mnesia:write(Admin)
    end.

change_password(Username, Password) when is_binary(Username), is_binary(Password) ->
    change_password_hash(Username, hash(Password)).

change_password_hash(Username, PasswordHash) ->
    update_pwd(Username, fun(User) ->
                        User#mqtt_admin{password = PasswordHash}
                end).

update_pwd(Username, Fun) ->
    Trans = fun() ->
                    User = 
                    case lookup_user(Username) of
                    [Admin] -> Admin;
                    [] ->
                           mnesia:abort("Username Not Found")
                    end,
                    mnesia:write(Fun(User))
            end,
    return(mnesia:transaction(Trans)).


-spec(lookup_user(binary()) -> [mqtt_admin()]).
lookup_user(Username) when is_binary(Username) -> mnesia:dirty_read(mqtt_admin, Username).

-spec(all_users() -> [binary()]).
all_users() -> mnesia:dirty_all_keys(mqtt_admin).

return({atomic, _}) ->
    ok;
return({aborted, Reason}) ->
    {error, Reason}.

check(undefined, _) ->
    {error, "Username undefined"};
check(_, undefined) ->
    {error, "Password undefined"};
check(Username, Password) ->
    case lookup_user(Username) of
        [#mqtt_admin{password = <<Salt:4/binary, Hash/binary>>}] ->
            case Hash =:= md5_hash(Salt, Password) of
                true  -> ok;
                false -> {error, "Password Error"}
            end;
        [] ->
            {error, "Username Not Found"}
    end.

%%--------------------------------------------------------------------
%% gen_server callbacks
%%--------------------------------------------------------------------

init([]) ->
    % Init mqtt_admin table
    case needs_defaut_user() of
        true ->
            insert_default_user();
        false ->
            ok
    end,
    {ok, state}.

handle_call(_Req, _From, State) ->
    {reply, error,  State}.

handle_cast(_Msg, State) ->
    {noreply, State}.

handle_info(_Msg, State) ->
    {noreply, State}.

terminate(_Reason, _State) ->
    ok.

code_change(_OldVsn, State, _Extra) ->
    {ok, State}.

%%--------------------------------------------------------------------
%% Internal functions
%%--------------------------------------------------------------------

hash(Password) ->
    SaltBin = salt(),
    <<SaltBin/binary, (md5_hash(SaltBin, Password))/binary>>.

md5_hash(SaltBin, Password) ->
    erlang:md5(<<SaltBin/binary, Password/binary>>).

salt() ->
    emqttd_time:seed(),
    Salt = random:uniform(16#ffffffff),
    <<Salt:32>>.

needs_defaut_user() ->
    is_empty(mqtt_admin).

is_empty(Tab) ->
    mnesia:dirty_first(Tab) == '$end_of_table'.

insert_default_user() ->
    Admin = #mqtt_admin{username = <<"admin">>,
                        password = hash(<<"public">>),
                        tags = <<"administrator">>},
    mnesia:transaction(fun mnesia:write/1, [Admin]).

     
