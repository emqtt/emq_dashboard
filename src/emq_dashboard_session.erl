%%--------------------------------------------------------------------
%% Copyright (c) 2013-2017 EMQ Enterprise, Inc. (http://emqtt.io)
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

%% @doc Session API.
-module(emq_dashboard_session).

-include("emq_dashboard.hrl").

-include_lib("emqttd/include/emqttd.hrl").

-include_lib("stdlib/include/qlc.hrl").

-import(proplists, [get_value/2]).

-export([list/3]).

-http_api({"sessions", list, [{"client_key", binary},
                              {"curr_page",  int, 1},
                              {"page_size",  int, 100}]}).

list(ClientId, PageNo, PageSize) when ?EMPTY_KEY(ClientId) ->
    TotalNum = lists:sum([ets:info(Tab, size) || Tab <- tables()]),
    Qh = qlc:append([qlc:q([E || E <- ets:table(Tab)]) || Tab <- tables()]),
    emq_dashboard:query_table(Qh, PageNo, PageSize, TotalNum, fun row/1);

list(ClientId, PageNo, PageSize) ->
    MP = {ClientId, '_', '_', '_'},
    Fun = fun() -> lists:append([ets:match_object(Tab, MP) || Tab <- tables()]) end,
    emq_dashboard:lookup_table(Fun, PageNo, PageSize, fun row/1).

tables() ->
    [mqtt_local_session].

row({ClientId, _Pid, _Persistent, SessInfo}) ->
    SessStats = emqttd_stats:get_session_stats(ClientId),
    [{clientId,         ClientId},
     {clean_sess,       get_value(clean_sess, SessInfo)},
     {max_inflight,     get_value(max_inflight, SessStats)},
     {inflight_len,     get_value(inflight_len, SessStats)},
     {mqueue_len,       get_value(mqueue_len, SessStats)},
     {mqueue_dropped,   get_value(mqueue_dropped, SessStats)},
     {awaiting_rel_len, get_value(awaiting_rel_len, SessStats)},
     {deliver_msg,      get_value(deliver_msg, SessStats)},
     {enqueue_msg,      get_value(enqueue_msg, SessStats)},
     {created_at,       strftime(get_value(created_at, SessInfo))}].

strftime(Ts) ->
    iolist_to_binary(emq_dashboard:strftime(Ts)).

