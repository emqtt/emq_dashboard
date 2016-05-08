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

%% @doc Overview API.
-module(emqttd_dashboard_overview).

-include("emqttd_dashboard.hrl").

-include("../../../include/emqttd.hrl").

-import(proplists, [get_value/2]).

-export([brokers/0,
         stats/0,
         ptype/0, 
         memory/0,
         cpu/0, 
         nodes_info/0,
         node_info/0,
         metrics/0, 
         listeners/0, 
         bnode/0]).

-http_api({"brokers",  brokers,   []}).
-http_api({"stats",    stats,     []}).
-http_api({"ptype",    ptype,     []}).
-http_api({"memory",   memory,    []}).
-http_api({"cpu",      cpu,       []}).
-http_api({"nodes",    nodes_info,[]}).
-http_api({"metrics",  metrics,   []}).
-http_api({"listeners",listeners, []}).
-http_api({"bnode",    bnode,     []}).

-define(KB, 1024).
-define(MB, (1024*1024)).
-define(GB, (1024*1024*1024)).

brokers() ->
    Funs = [sysdescr, version, uptime, datetime],
    {ok, lists:map(fun broker/1, Funs)}.

broker(Fun) ->
    {Fun, iolist_to_binary(emqttd_broker:Fun())}.

stats() ->
    {ok, emqttd_stats:getstats()}.

ptype() ->
    {ok, emqttd_vm:get_port_types()}.

memory() ->
    {ok, emqttd_vm:get_memory()}.

cpu() ->
    {ok, emqttd_vm:loads()}.

nodes_info() ->
    {ok, [rpc:call(Node, ?MODULE, node_info, []) || Node <- [node() | nodes()]]}.

node_info() ->
    CpuInfo = [{K, list_to_binary(V)} || {K, V} <- emqttd_vm:loads()],
    Memory  = emqttd_vm:get_memory(),
    [{name, node()},
     {total_memory, kmg(get_value(allocated, Memory))},
     {used_memory,  kmg(get_value(used, Memory))},
     {process_available, erlang:system_info(process_limit)},
     {process_used, erlang:system_info(process_count)},
     {max_fds, get_value(max_fds, erlang:system_info(check_io))} | CpuInfo].

metrics() ->
    {ok, emqttd_metrics:all()}.
   
listeners() ->
    {ok, lists:map(fun listener/1, esockd:listeners())}.

listener({{Protocol, Port}, Pid}) ->
    [{protocol, Protocol}, {port, Port},
     {max_clients, esockd:get_max_clients(Pid)},
     {current_clients, esockd:get_current_clients(Pid)}].

bnode() ->
    {ok, [{node, node()}]}.

kmg(Byte) when Byte > ?GB ->
    float(Byte / ?GB, "G");
kmg(Byte) when Byte > ?MB ->
    float(Byte / ?MB, "M");
kmg(Byte) when Byte > ?KB ->
    float(Byte / ?MB, "K");
kmg(Byte) ->
    Byte.

float(F, S) ->
    iolist_to_binary(io_lib:format("~.2f~s", [F, S])).

