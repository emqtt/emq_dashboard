
emq_dashboard
=============

Dashboard for the EMQ Broker.

Build
-----

make && make ct

Configuration
------------

```
dashboard.listener = 18083

dashboard.listener.acceptors = 2

dashboard.listener.max_clients = 512
```

Load Plugin
-----------

```
./bin/emqttd_ctl plugins load emq_dashboard
```

Login
-----

URL: http://host:18083

Username: admin

Password: public

License
-------

Apache License Version 2.0
