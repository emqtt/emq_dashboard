var PageInfo = function(currPage, pageSize, totalNum) {
	this.currPage = currPage;
	this.pageSize = pageSize;
	this.totalNum = totalNum;
	this.totalPage = 0;
};
PageInfo.prototype.countTotalPage = function(totalPage) {
	if (totalPage) {
		this.totalPage = totalPage;
		return;
	}
	if (this.totalNum % this.pageSize == 0) {
		this.totalPage = this.totalNum / this.pageSize;
	} else {
		this.totalPage = this.totalNum / this.pageSize + 1;
	}
};
PageInfo.prototype.offsetting = function() {
	if (this.totalNum == 0) {
		return 0;
	} else {
		return (this.currPage - 1) * this.pageSize + 1;
	}
}
PageInfo.prototype.endNum = function() {
	if (this.currPage == this.totalPage) {
		return this.totalNum;
	} else {
		return this.offsetting() + this.pageSize - 1;
	}
}

jQuery.fn.pagination = function(pageInfo, module) {
	var pagination = $(this);
	var previous = pagination.find(".previous");
	var next = pagination.find(".next");
	
	if (pageInfo.totalNum == 0) {
		previous.replaceWith('<button type="button" class="btn btn-white disabled previous">Previous</button>');
		next.replaceWith('<button type="button" class="btn btn-white disabled next">Next</button>');
		return;
	}
	if (pageInfo.currPage <= 1) {
		previous.replaceWith('<button type="button" class="btn btn-white disabled previous">Previous</button>');
	} else {
		previous.replaceWith('<button type="button" class="btn btn-white previous" onclick="'+module+'.setCurrPage('+(pageInfo.currPage-1)+');">Previous</button>');
	}
	if (pageInfo.currPage >= pageInfo.totalPage) {
		next.replaceWith('<button type="button" class="btn btn-white disabled next">Next</button>');
	} else {
		next.replaceWith('<button type="button" class="btn btn-white next" onclick="'+module+'.setCurrPage('+(pageInfo.currPage+1)+');">Next</button>');
	}
	
	/*
	var p = $(this).empty();
	if (pageInfo.totalNum == 0) {
		p.append('<li class="paginate_button previous disabled"><a href="javascript:;">Previous</a></li>');
		p.append('<li class="paginate_button next disabled"><a href="javascript:;">Next</a></li>');
		return;
	}
	
	if (pageInfo.currPage <= 1) {
		p.append('<li class="paginate_button previous disabled"><a href="javascript:;">Previous</a></li>');
	} else {
		p.append('<li class="paginate_button previous"><a href="javascript:;" onclick="'+module+'.setCurrPage('+(pageInfo.currPage-1)+');">Previous</a></li>');
	}
	
	var len = 6;
	// 起始按钮
	var start = 1;
	// 结束按钮
	var end = pageInfo.totalPage;
	if ((pageInfo.currPage - 2) > 1) {
		start = pageInfo.currPage - 2;
	}
	if ((pageInfo.currPage + 3) < pageInfo.totalPage) {
		end = pageInfo.currPage + 3;
	}
	if (pageInfo.totalPage >= len) {
		if (end < len) {
			end = len;
		}
		if ((end - start) < (len - 1)) {
			start = end - len + 1;
		}
	}
	if (start > 1) {
		p.append('<li class="paginate_button"><a href="javascript:;" onclick="'+module+'.setCurrPage(1);">1</a></li>');
		if (start > 2) {
			p.append('<li class="paginate_button"><a>...</a></li>');
		}
	}
	for (var i = start; i <= end; i++) {
		if (i == pageInfo.currPage) {
			p.append('<li class="paginate_button active"><a href="javascript:;" onclick="'+module+'.setCurrPage('+i+');">'+i+'</a></li>');
		} else {
			p.append('<li class="paginate_button"><a href="javascript:;" onclick="'+module+'.setCurrPage('+i+');">'+i+'</a></li>');
		}
	}
	if (end < pageInfo.totalPage) {
		if (end < pageInfo.totalPage-1) {
			p.append('<li class="paginate_button"><a>...</a></li>');
		}
		p.append('<li class="paginate_button"><a href="javascript:;" onclick="'+module+'.setCurrPage('+pageInfo.totalPage+');">'+pageInfo.totalPage+'</a></li>');
	}

	if (pageInfo.currPage >= pageInfo.totalPage) {
		p.append('<li class="paginate_button next disabled"><a href="javascript:;">Next</a></li>');
	} else {
		p.append('<li class="paginate_button next"><a href="javascript:;" onclick="'+module+'.setCurrPage('+(pageInfo.currPage+1)+');">Next</a></li>');
	}
	*/
}

// checks whether the content is in RTL mode
function rtl() {
	if (typeof window.isRTL == 'boolean')
		return window.isRTL;

	window.isRTL = jQuery("html").get(0).dir == 'rtl' ? true : false;

	return window.isRTL;
}

// Page Loader
function show_loading_bar(options) {
	var defaults = {
		pct : 0,
		delay : 1.3,
		wait : 0,
		before : function() {
		},
		finish : function() {
		},
		resetOnEnd : true
	};

	if (typeof options == 'object')
		defaults = jQuery.extend(defaults, options);
	else if (typeof options == 'number')
		defaults.pct = options;

	if (defaults.pct > 100)
		defaults.pct = 100;
	else if (defaults.pct < 0)
		defaults.pct = 0;

	var $ = jQuery, $loading_bar = $(".xenon-loading-bar");

	if ($loading_bar.length == 0) {
		$loading_bar = $('<div class="xenon-loading-bar progress-is-hidden"><span data-pct="0"></span></div>');
		public_vars.$body.append($loading_bar);
	}

	var $pct = $loading_bar.find('span'), current_pct = $pct.data('pct'), is_regress = current_pct > defaults.pct;

	defaults.before(current_pct);

	TweenMax.to($pct, defaults.delay, {
		css : {
			width : defaults.pct + '%'
		},
		delay : defaults.wait,
		ease : is_regress ? Expo.easeOut : Expo.easeIn,
		onStart : function() {
			$loading_bar.removeClass('progress-is-hidden');
		},
		onComplete : function() {
			var pct = $pct.data('pct');

			if (pct == 100 && defaults.resetOnEnd) {
				hide_loading_bar();
			}

			defaults.finish(pct);
		},
		onUpdate : function() {
			$pct.data('pct', parseInt($pct.get(0).style.width, 10));
		}
	});
}

function hide_loading_bar() {
	var $ = jQuery, $loading_bar = $(".xenon-loading-bar"), $pct = $loading_bar
			.find('span');

	$loading_bar.addClass('progress-is-hidden');
	$pct.width(0).data('pct', 0);
}

Date.prototype.format = function(format) {
	var o = {
		"M+" : this.getMonth() + 1, // month
		"d+" : this.getDate(), // day
		"h+" : this.getHours(), // hour
		"m+" : this.getMinutes(), // minute
		"s+" : this.getSeconds(), // second
		"q+" : Math.floor((this.getMonth() + 3) / 3), // quarter
		"S" : this.getMilliseconds() // millisecond
	}

	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	}

	for ( var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
					: ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
};

function loading(module, fun) {
	show_loading_bar({
		pct: 100,
		delay: 0.5,
		finish: function(pct) {
			var loadingAjax = $('#context');
			//loadingAjax.empty().append(
			//	'<div class="page-loading-overlay">'
			//	+ '<div class="loader-2"></div></div>');
			loadingAjax.load(module, function() {
            fun();
            stickFooterToBottom();
            });
		}
	});
}

var dashApi = null;
function initWebPage(url, config) {
	dashApi = new DashboardApi();
	dashApi.init(config, function() {
		stickFooterToBottom();
	});

	// 注册事件
	regEvent();
	// 展现主体部分
	var strs = url.split('#');
	if (strs.length == 1) {
		setMenuClass('overview');
		showOverview();
	} else if (strs[1] == '/clients') {
		setMenuClass('clients');
		showClients();
	} else if (strs[1] == '/sessions') {
		setMenuClass('sessions');
		showSessions();
	} else if (strs[1] == '/topics') {
		setMenuClass('topics');
		showTopics();
	} else if (strs[1] == '/routes') {
		setMenuClass('routes');
		showRoutes();
	} else if (strs[1] == '/subscriptions') {
		setMenuClass('subscriptions');
		showSubscriptions();
	} else if (strs[1] == '/websocket') {
		setMenuClass('websocket');
		showWebsocket();
	} else if (strs[1] == '/users') {
		setMenuClass('users');
		showUsers();
	} else if (strs[1] == '/http_api') {
		setMenuClass('http_api');
		showHttpApi();
	} else {
		setMenuClass('overview');
		showOverview();
	}
};

/**
 * 设置菜单选中样式
 * 
 * @param modName
 */
function setMenuClass(modName) {
	if (modName == 'overview') {
		$('#title_bar').hide();
	} else {
		$('#title_bar').show();
	}
	if (modName == 'websocket') {
		if (!window.WebSocket) {
			var msg = "WebSocket not supported by this browser.";
			alert(msg);
			throw new Error(msg);
		}
	}
	$('#main-menu>li').each(function() {
		$(this).removeClass('active');
		var mod = $(this).attr('module');
		if (mod == modName) {
			$(this).addClass('active');
		}
	});
};

/**
 * 注册事件
 */
function regEvent() {
	showCurrentUser();
	// 注册单击事件
	$('#logout').on('click', function(ev) {
		ev.preventDefault();
		clearAuth();
	});

	$('#main-menu>li').each(function(index) {
		var mod = $(this).attr('module');
		if (mod == 'overview') {
			$(this).click(function() {
				setMenuClass('overview');
				showOverview();
			});
		} else if (mod == 'clients') {
			$(this).click(function() {
				setMenuClass('clients');
				showClients();
			});
		} else if (mod == 'sessions') {
			$(this).click(function() {
				setMenuClass('sessions');
				showSessions();
			});
		} else if (mod == 'topics') {
			$(this).click(function() {
				setMenuClass('topics');
				showTopics();
			});
		} else if (mod == 'routes') {
			$(this).click(function() {
				setMenuClass('routes');
				showRoutes();
			});
		} else if (mod == 'subscriptions') {
			$(this).click(function() {
				setMenuClass('subscriptions');
				showSubscriptions();
			});
		} else if (mod == 'websocket') {
			$(this).click(function() {
				setMenuClass('websocket');
				showWebsocket();
			});
		} else if (mod == 'users') {
			$(this).click(function() {
				setMenuClass('users');
				showUsers();
			});
		} else if (mod == 'http_api') {
			$(this).click(function() {
				setMenuClass('http_api');
				showHttpApi();
			});
		}
	});
};

function clearAuth() {
	dashApi.logout(function(ret, err) {
		if (ret) {
			window.location.href = '/';
		} else {
			window.location.href = '/';
		}
	});
}

function showCurrentUser() {
	dashApi.user_current(function(ret, err) {
		if (ret) {
			$('#current_user').text(ret.username);
		} else {
			console.log(err);
		}
	});
};

function showOverview() {
	loading('overview.html', function() {
		// 加载系统基本信息
		overview.broker();
		
		// 加载nodes
		overview.nodes();
		
		// 加载stats
		overview.stats();
		
		// 加载metrics
		overview.metrics();
		
		// 加载listeners
		overview.listeners();
	
        clearInterval(overview.timetask);
		overview.timetask = setInterval(function() {
		        overview.broker();
			overview.nodes();
			overview.stats();
			overview.metrics();
		}, 10000);
	});
};

(function(w) {
	var ov = {};
	var c = null, tt = null;
	
	ov.broker = function() {
            dashApi.broker(function(ret, err) {
                if (ret) {
                    $('#sys_name').text(ret.sysdescr);
                    $('#sys_version').text(ret.version);
                    $('#sys_uptime').text(ret.uptime);
                    $('#sys_time').text(ret.datetime);
                }
            });
	};
	
	ov.nodes = function() {
		dashApi.nodes(function(ret, err) {
			if (ret) {
				$('#nodes_count').text(ret.length);
				var tby = $('#nodes tbody').empty();
				if (ret.length > 0) {
					for (var i = 0; i < ret.length; i++) {
						var obj = ret[i];
						tby.append('<tr>' +
								'<td>' + obj['name'] + '</td>' +
								'<td>' + obj['process_used'] + ' / ' + obj['process_available'] + '</td>' +
								'<td>' + obj['load1'] + ' / ' + obj['load5'] + ' / ' + obj['load15'] + '</td>' +
								'<td>' + obj['used_memory'] + ' / ' + obj['total_memory'] + '</td>' +
								'<td>' + obj['max_fds'] + '</td>' +
								'</tr>');
					}
				} else {
					tby.append(
							'<tr><td colspan="8">' +
							'<p style="padding: 12px;">... no nodes ...</p>' +
							'</td></tr>');
				}
			} else {
				console.log(err);
			}
		});
	};
	
	ov.stats = function() {
		dashApi.stats(function(ret, err) {
			if (ret) {
				for(var key in ret) {
                    $('#' + key.split('/').join('_')).text(ret[key]);
                }
			} else {
				console.log(err);
			}
		});
	};
	
	ov.metrics = function() {
		dashApi.metrics(function(ret, err) {
			if (ret) {
				for(var key in ret) {
                    $('#' + key.split('/').join('_')).text(ret[key]);
                }
			} else {
				console.log(err);
			}
		});
	};
	
	ov.listeners = function() {
		dashApi.listeners(function(ret, err) {
			if (ret) {
				$('#listeners_count').text(ret.length);
				var tby = $('#listeners tbody').empty();
				if (ret.length > 0) {
					for (var i = 0; i < ret.length; i++) {
						var obj = ret[i];
						tby.append('<tr>' +
								'<td>' + obj['protocol'] + '</td>' +
								'<td>' + obj['port'] + '</td>' +
								'<td>' + obj['max_clients'] + '</td>' +
								'<td>' + obj['current_clients'] + '</td>' +
								'</tr>');
					}
				} else {
					tby.append(
							'<tr><td colspan="8">' +
							'<p style="padding: 12px;">... no listeners ...</p>' +
							'</td></tr>');
				}
			} else {
				console.log(err);
			}
		});
	};

	// 关闭任务
	ov.clearTask = function() {
		try {
			clearInterval(tt);
			c.disconnect();
		} catch (error) {}
	};

	ov.client = c;
	ov.timetask = tt;
	w.overview = ov;
})(window);

function showClients() {
	// 标题导航条
	//$('#title_bar .description').text("Clients List");
	$('#title_bar .title').text("Clients");
	$('#title_bar .breadcrumb-env').html(
			'<ol class="breadcrumb bc-1">' +
			'<li><i class="fa-home"></i>Overview</li>' +
			'<li class="active"><strong>Clients</strong></li>' +
			'</ol>');
	
	// 加载Clients信息
	loading('clients.html', function() {
		clients.loadTable();
	});
};

(function(w) {
	var cs = {};
	cs.pInfo = new PageInfo(1, 100, 0);
	cs.client_key = null;
	
	cs.setPageSize = function(pageSize) {
		this.pInfo.pageSize = pageSize;
		this.pInfo.currPage = 1;
		this.loadTable();
	};
	
	cs.search = function(clientKey) {
		this.client_key = clientKey;
		this.pInfo.currPage = 1;
		this.loadTable();
	};
	
	cs.setCurrPage = function(currPage) {
		this.pInfo.currPage = currPage;
		this.loadTable();
	};
	
	cs.loadTable = function() {
		var _this = this;
		$('#user_key').val(this.client_key);
		
		var params = {page_size : this.pInfo.pageSize,
				curr_page : this.pInfo.currPage,
				client_key : this.client_key};
		// Table List
		dashApi.clients(params, function(ret, err) {
			if (ret) {
				var result = [];
				if (ret instanceof Array) {
					result = ret;
					_this.pInfo.currPage = 1;
					_this.pInfo.pageSize = ret.length;
					_this.pInfo.totalNum = ret.length;
					_this.pInfo.totalPage = 1;
				} else {
					result = ret.result;
					_this.pInfo.currPage = ret.currentPage;
					_this.pInfo.pageSize = ret.pageSize;
					_this.pInfo.totalNum = ret.totalNum;
					_this.pInfo.totalPage = ret.totalPage;
				}
				// 加载分页按钮
				$('#pagination').pagination(_this.pInfo, 'clients');
				$('#page_size').text(_this.pInfo.pageSize);
				
				$('#clients_count_all').text(_this.pInfo.totalNum);
				$('#clients_count_start').text(_this.pInfo.offsetting());
				$('#clients_count_end').text(_this.pInfo.endNum());
				var tby = $('#clients tbody').empty();
				if (_this.pInfo.totalNum > 0) {
					for (var i = 0; i < result.length; i++) {
						var obj = result[i];
						tby.append('<tr>' +
								'<td>' + obj['clientId'] + '</td>' +
								'<td>' + obj['username'] + '</td>' +
								'<td>' + obj['ipaddress'] + '</td>' +
								'<td>' + obj['port'] + '</td>' +
								'<td>' + obj['clean_sess'] + '</td>' +
								'<td>' + obj['proto_ver'] + '</td>' +
								'<td>' + obj['keepalive'] + '</td>' +
								'<td>' + obj['connected_at'] + '</td>' +
								'</tr>');
					}
				} else {
					tby.append(
							'<tr><td colspan="8">' +
							'<p style="padding: 12px;">... no clients ...</p>' +
							'</td></tr>');
				}
			} else {
				console.log(err);
			}
		});
	};
	
	w.clients = cs;
})(window);

function showSessions() {
	// 标题导航条
	//$('#title_bar .description').text("Sessions List");
	$('#title_bar .title').text("Sessions");
	$('#title_bar .breadcrumb-env').html(
			'<ol class="breadcrumb bc-1">' +
			'<li><i class="fa-home"></i>Overview</li>' +
			'<li class="active"><strong>Sessions</strong></li>' +
			'</ol>');
	
	// 加载Sessions信息
	loading('sessions.html', function() {
		sessions.loadTable();
	});
};

(function(w) {
	var se = {};
	se.pInfo = new PageInfo(1, 100, 0);
	se.client_key = null;
	
	se.setPageSize = function(pageSize) {
		this.pInfo.pageSize = pageSize;
		this.pInfo.currPage = 1;
		this.loadTable();
	};
	
    se.search = function(clientKey) {
		this.client_key = clientKey;
		this.pInfo.currPage = 1;
		this.loadTable();
	};
	
	se.setCurrPage = function(currPage) {
		this.pInfo.currPage = currPage;
		this.loadTable();
	};
	
	se.loadTable = function() {
		var _this = this;
		$('#user_key').val(this.client_key);
		
		var params = {page_size : this.pInfo.pageSize,
				curr_page : this.pInfo.currPage,
				client_key : this.client_key};
		// Table List
		dashApi.sessions(params, function(ret, err) {
			if (ret) {
				var result = [];
				if (ret instanceof Array) {
					result = ret;
					_this.pInfo.currPage = 1;
					_this.pInfo.pageSize = ret.length;
					_this.pInfo.totalNum = ret.length;
					_this.pInfo.totalPage = 1;
				} else {
					result = ret.result;
					_this.pInfo.currPage = ret.currentPage;
					_this.pInfo.pageSize = ret.pageSize;
					_this.pInfo.totalNum = ret.totalNum;
					_this.pInfo.totalPage = ret.totalPage;
				}
				// 加载分页按钮
				$('#pagination').pagination(_this.pInfo, 'sessions');
				$('#page_size').text(_this.pInfo.pageSize);
				
				$('#sessions_count_all').text(_this.pInfo.totalNum);
				$('#sessions_count_start').text(_this.pInfo.offsetting());
				$('#sessions_count_end').text(_this.pInfo.endNum());
				var tby = $('#sessions tbody').empty();
				if (_this.pInfo.totalNum > 0) {
					for (var i = 0; i < result.length; i++) {
						var obj = result[i];
						tby.append('<tr>' +
								'<td>' + obj['clientId'] + '</td>' +
								'<td>' + obj['clean_sess'] + '</td>' +
								'<td>' + obj['max_inflight'] + '</td>' +
								'<td>' + obj['message_queue'] + '</td>' +
								'<td>' + obj['message_dropped'] + '</td>' +
								'<td>' + obj['awaiting_rel'] + '</td>' +
								'<td>' + obj['awaiting_ack'] + '</td>' +
								'<td>' + obj['awaiting_comp'] + '</td>' +
								'<td>' + obj['created_at'] + '</td>' +
								'</tr>');
					}
				} else {
					tby.append(
							'<tr><td colspan="9">' +
							'<p style="padding: 12px;">... no sessions ...</p>' +
							'</td></tr>');
				}
			} else {
				console.log(err);
			}
		});
	};
	
	w.sessions = se;
})(window);

function showTopics() {
	// 标题导航条
	//$('#title_bar .description').text("Topics List");
	$('#title_bar .title').text("Topics");
	$('#title_bar .breadcrumb-env').html(
			'<ol class="breadcrumb bc-1">' +
			'<li><i class="fa-home"></i>Overview</li>' +
			'<li class="active"><strong>Topics</strong></li>' +
			'</ol>');
	
	// 加载Topics信息
	loading('topics.html', function() {
        topics.loadTable();
    });
};

(function(w) {
	var topics = {};
	topics.pInfo = new PageInfo(1, 100, 0);
	topics.topic = null;
	
	topics.setPageSize = function(pageSize) {
		this.pInfo.pageSize = pageSize;
		this.pInfo.currPage = 1;
		this.loadTable();
	};
	
	topics.setCurrPage = function(currPage) {
		this.pInfo.currPage = currPage;
		this.loadTable();
	};

    topics.search = function(topicKey) {
		this.topic= topicKey;
		this.pInfo.currPage = 1;
		this.loadTable();
	};
	
	topics.loadTable = function() {
		var _this = this;
		$('#topic_key').val(this.topic);
		
		var params = {page_size : this.pInfo.pageSize,
				curr_page : this.pInfo.currPage,
				topic: this.topic};
		// Table List
		dashApi.topics(params, function(ret, err) {
			if (ret) {
				var result = [];
				if (ret instanceof Array) {
					result = ret;
					_this.pInfo.currPage = 1;
					_this.pInfo.pageSize = ret.length;
					_this.pInfo.totalNum = ret.length;
					_this.pInfo.totalPage = 1;
				} else {
					result = ret.result;
					_this.pInfo.currPage = ret.currentPage;
					_this.pInfo.pageSize = ret.pageSize;
					_this.pInfo.totalNum = ret.totalNum;
					_this.pInfo.totalPage = ret.totalPage;
				}
				// 加载分页按钮
				$('#pagination').pagination(_this.pInfo, 'topics');
				$('#page_size').text(_this.pInfo.pageSize);
				
				$('#topics_count_all').text(_this.pInfo.totalNum);
				$('#topics_count_start').text(_this.pInfo.offsetting());
				$('#topics_count_end').text(_this.pInfo.endNum());
				var tby = $('#topics tbody').empty();
				if (_this.pInfo.totalNum > 0) {
					for (var i = 0; i < result.length; i++) {
						var obj = result[i];
						tby.append('<tr>' +
								'<td>' + obj['topic'] + '</td>' +
								'<td>' + obj['flags'] + '</td>' +
								'</tr>');
					}
				} else {
					tby.append(
							'<tr><td colspan="9">' +
							'<p style="padding: 12px;">... no topics ...</p>' +
							'</td></tr>');
				}
			} else {
				console.log(err);
			}
		});
	};
	
	w.topics = topics;
})(window);

function showRoutes() {
	// 标题导航条
	//$('#title_bar .description').text("Routes List");
	$('#title_bar .title').text("Routes");
	$('#title_bar .breadcrumb-env').html(
			'<ol class="breadcrumb bc-1">' +
			'<li><i class="fa-home"></i>Overview</li>' +
			'<li class="active"><strong>Routes</strong></li>' +
			'</ol>');
	
	// 加载Routes信息
	loading('routes.html', function() {
        routes.loadTable();
    });
};

(function(w) {
	var routes = {};
	routes.pInfo = new PageInfo(1, 100, 0);
	routes.topic = null;
	
	routes.setPageSize = function(pageSize) {
		this.pInfo.pageSize = pageSize;
		this.pInfo.currPage = 1;
		this.loadTable();
	};
	
	routes.setCurrPage = function(currPage) {
		this.pInfo.currPage = currPage;
		this.loadTable();
	};
	
    routes.search = function(topicKey) {
		this.topic= topicKey;
		this.pInfo.currPage = 1;
		this.loadTable();
	};

	routes.loadTable = function() {
		var _this = this;
		$('#topic_key').val(this.topic);
		
		var params = {page_size : this.pInfo.pageSize,
				curr_page : this.pInfo.currPage,
				topic: this.topic};
		// Table List
		dashApi.routes(params, function(ret, err) {
			if (ret) {
				var result = [];
				if (ret instanceof Array) {
					result = ret;
					_this.pInfo.currPage = 1;
					_this.pInfo.pageSize = ret.length;
					_this.pInfo.totalNum = ret.length;
					_this.pInfo.totalPage = 1;
				} else {
					result = ret.result;
					_this.pInfo.currPage = ret.currentPage;
					_this.pInfo.pageSize = ret.pageSize;
					_this.pInfo.totalNum = ret.totalNum;
					_this.pInfo.totalPage = ret.totalPage;
				}
				// 加载分页按钮
				$('#pagination').pagination(_this.pInfo, 'routes');
				$('#page_size').text(_this.pInfo.pageSize);
				
				$('#routes_count_all').text(_this.pInfo.totalNum);
				$('#routes_count_start').text(_this.pInfo.offsetting());
				$('#routes_count_end').text(_this.pInfo.endNum());
				var tby = $('#routes tbody').empty();
				if (_this.pInfo.totalNum > 0) {
					for (var i = 0; i < result.length; i++) {
						var obj = result[i];
						tby.append('<tr>' +
								'<td>' + obj['topic'] + '</td>' +
								'<td>' + obj['node'] + '</td>' +
								'</tr>');
					}
				} else {
					tby.append(
							'<tr><td colspan="9">' +
							'<p style="padding: 12px;">... no routes ...</p>' +
							'</td></tr>');
				}
			} else {
				console.log(err);
			}
		});
	};
	
	w.routes = routes;
})(window);

function showSubscriptions() {
	// 标题导航条
	//$('#title_bar .description').text("Subscriptions List");
	$('#title_bar .title').text("Subscriptions");
	$('#title_bar .breadcrumb-env').html(
			'<ol class="breadcrumb bc-1">' +
			'<li><i class="fa-home"></i>Overview</li>' +
			'<li class="active"><strong>Subscriptions</strong></li>' +
			'</ol>');
	
	// 加载Subscriptions信息
	loading('subscriptions.html', function() {
		subscriptions.loadTable();
	});
};

(function(w) {
	var subscriptions = {};
	subscriptions.pInfo = new PageInfo(1, 100, 0);
	subscriptions.client_key = null;
	
	subscriptions.setPageSize = function(pageSize) {
		this.pInfo.pageSize = pageSize;
		this.pInfo.currPage = 1;
		this.loadTable();
	};
	
    subscriptions.search = function(clientKey) {
		this.client_key = clientKey;
		this.pInfo.currPage = 1;
		this.loadTable();
	};
	
	subscriptions.setCurrPage = function(currPage) {
		this.pInfo.currPage = currPage;
		this.loadTable();
	};
	
	subscriptions.loadTable = function() {
		var _this = this;
		$('#user_key').val(this.client_key);
		
		var params = {page_size : this.pInfo.pageSize,
				curr_page : this.pInfo.currPage,
				client_key : this.client_key};
		// Table List
		dashApi.subscriptions(params, function(ret, err) {
			if (ret) {
				var result = [];
				if (ret instanceof Array) {
					result = ret;
					_this.pInfo.currPage = 1;
					_this.pInfo.pageSize = ret.length;
					_this.pInfo.totalNum = ret.length;
					_this.pInfo.totalPage = 1;
				} else {
					result = ret.result;
					_this.pInfo.currPage = ret.currentPage;
					_this.pInfo.pageSize = ret.pageSize;
					_this.pInfo.totalNum = ret.totalNum;
					_this.pInfo.totalPage = ret.totalPage;
				}
				// 加载分页按钮
				$('#pagination').pagination(_this.pInfo, 'subscriptions');
				$('#page_size').text(_this.pInfo.pageSize);
				
				$('#subscriptions_count_all').text(_this.pInfo.totalNum);
				$('#subscriptions_count_start').text(_this.pInfo.offsetting());
				$('#subscriptions_count_end').text(_this.pInfo.endNum());
				var tby = $('#subscriptions tbody').empty();
				if (_this.pInfo.totalNum > 0) {
					for (var i = 0; i < result.length; i++) {
						var obj = result[i];
						tby.append('<tr>' +
								'<td>' + obj['clientid'] + '</td>' +
								'<td>' + obj['topic'] + '</td>' +
								'<td>' + obj['qos'] + '</td>' +
								'</tr>');
					}
				} else {
					tby.append(
							'<tr><td colspan="9">' +
							'<p style="padding: 12px;">... no subscriptions...</p>' +
							'</td></tr>');
				}
			} else {
				console.log(err);
			}
		});
	};
	
	w.subscriptions = subscriptions;
})(window);

function showWebsocket() {
	// 标题导航条
	//$('#title_bar .description').text("MQTT Over Websocket");
	$('#title_bar .title').text("Websocket");
	$('#title_bar .breadcrumb-env').html(
			'<ol class="breadcrumb bc-1">' +
			'<li><i class="fa-home"></i>Overview</li>' +
			'<li class="active"><strong>Websocket</strong></li>' +
			'</ol>');
	
	// 加载WebSocket信息
	loading('websocket.html', function() {
		$('#host').val(location.hostname);
		$('#port').val(8083);
		$('#client_id').val('C_' + new Date().getTime());
		
		var client = null;
		$('#connect_btn').click(function() {
			if(client == null || !client.isConnected()) {
				client = wSocket.newClient();
				wSocket.connect(client);
			} else {
				alert("Don't click");
			}
		});

		$('#disconnect_btn').click(function() {
			if(client != null && client.isConnected()) {
				wSocket.disconnect(client);
			} else {
				alert("Don't click");
			}
		});

		$('#subscribe_btn').click(function() {
			wSocket.subscribe(client);
		});
		
		$('#send_btn').click(function() {
			wSocket.sendMessage(client);
		});
	});
};

(function(w) {
	// called when the client loses its connection
	function onConnectionLost(responseObject) {
		if (responseObject.errorCode !== 0) {
			console.log("onConnectionLost: " + responseObject.errorMessage);
		}
	}

	// called when a message arrives
	function onMessageArrived(message) {
		console.log("onMessageArrived: " + message.payloadString);
		var nowStr = (new Date()).format("yyyy-MM-dd hh:mm:ss");
		$('#receive_message').append('<div>onMessageArrived: ' 
			+ message.payloadString + '<cite> ' 
			+ nowStr + '</cite></div>');
	}
	
	var wSocket = {};
	
	wSocket.newClient = function() {
		var host = $('#host').val();
		var port = $('#port').val();
		var clientId = $('#client_id').val();
		return new Paho.MQTT.Client(host, Number(port), clientId);
	};
	
	wSocket.connect = function(client) {
		// set callback handlers
		client.onConnectionLost = onConnectionLost;
		client.onMessageArrived = onMessageArrived;
		
		var options = {
			onSuccess : function() {
				console.log("The client connect success.");
				$('#connect_state').text('CONNECTED');
				$('#connect_btn').addClass("disabled").removeClass("btn-success").addClass("btn-gray");
				$('#disconnect_btn').removeClass("disabled").removeClass("btn-gray").addClass("btn-success");
			}
		};
		var userName = $('#user_name').val();
		var password = $('#password').val();
		var keepAlive = $('#keep_alive').val();
		var cleanSession = $('#clean_session:checked');
		if (userName != "") {
			options.userName = userName;
		}
		if (password != "") {
			options.password = password;
		}
		if (keepAlive != "") {
			options.keepAliveInterval = Number(keepAlive);
		}
		if (cleanSession.length > 0) {
		    options.cleanSession = true;
		} else {
		    options.cleanSession = false;
		}
		client.connect(options);
	};
	
	wSocket.disconnect = function(client) {
		client.disconnect();
		console.log("The client disconnect success.");
		$('#connect_state').text('DISCONNECTED');
		$('#connect_btn').removeClass("disabled").removeClass("btn-gray").addClass("btn-success");
		$('#disconnect_btn').addClass("disabled").removeClass("btn-success").addClass("btn-gray");
	};
	
	wSocket.subscribe = function(client) {
		var topic = $('#subscription').val();
		var qos = $('#qos_2').val();
		client.subscribe(topic, {qos : Number(qos)});
		var nowStr = (new Date()).format("yyyy-MM-dd hh:mm:ss");
		$('#subscriptions_list').append('<div>Subscribe Topic: ' 
			+ topic + '<cite> ' 
			+ nowStr + '</cite></div>');
	};
	
	wSocket.sendMessage = function(client) {
		var topic = $('#topic').val();
		var msg = $('#message').val();
		var qos = $('#qos_3').val();
		var retained = $('#retained:checked');
		var message = new Paho.MQTT.Message(msg);
		message.destinationName = topic;
		message.qos = Number(qos);
		if (retained.length > 0) {
		    message.retained = true;
		} else {
		    message.retained = false;
		}
		client.send(message);
		var nowStr = (new Date()).format("yyyy-MM-dd hh:mm:ss");
		$('#send_message_list').append('<div>Send Message: ' 
				+ msg + '<cite> ' 
				+ nowStr + '</cite></div>');
	};
	
	w.wSocket = wSocket;
})(window);

function showUsers() {
	// 标题导航条
	//$('#title_bar .description').text("Users List");
	$('#title_bar .title').text("Users");
	$('#title_bar .breadcrumb-env').html(
			'<ol class="breadcrumb bc-1">' +
			'<li><i class="fa-home"></i>Overview</li>' +
			'<li class="active"><strong>Users</strong></li>' +
			'</ol>');
	
	// 加载Users信息
	loading('users.html', function() {
		User.showTable();
		
		if ($('#modal_confirm_del_user').length <= 0) {
			$.ajax({
				url : 'user_modal.html',
				type : 'GET',
				dataType : 'html',
				success : function(ret) {
					$('body').append(ret);
				}
			});
		}
		
		$('#user_add_btn').on('click', function(ev) {
			ev.preventDefault();
			var m = $('#modal_user_add');
			m.modal('show');
			User.setAddDate(m);
		});
	});
};

var User = {
		showTable : function() {
			dashApi.users(function(ret, err) {
				if (ret) {
					$('#users_count_all').text(ret.length);
					var tby = $('#users tbody').empty();
					if (ret.length > 0) {
						for (var i = 0; i < ret.length; i++) {
							var obj = ret[i];
							tby.append('<tr>' +
									'<td>' + (i + 1) + '</td>' +
									'<td>' + obj['name'] + '</td>' +
									'<td>' + obj['tag'] + '</td>' +
									'<td>' +
									'<a href="javascript:;" onclick="User.editPage(\''+obj.name+'\',\''+obj.tag+'\')" class="btn btn-success btn-sm btn-icon icon-left">' +
									'	Edit' +
									'</a>' +
									'<a href="javascript:;" onclick="User.delPage(\''+obj.name+'\')" class="btn btn-danger btn-sm btn-icon icon-left">' +
									'	Delete' +
									'</a>' +
									'</td>' +
									'</tr>');
						}
					} else {
						tby.append(
								'<tr><td colspan="9">' +
								'<p style="padding: 12px;">... no users ...</p>' +
								'</td></tr>');
					}
				} else {
					//console.log(err);
					alert("failure");
				}
			});
		},
		
		delPage : function(username) {
	    	var m = $('#modal_confirm_del_user');
			m.modal('show');
			m.find('#user_del_name').val(username);
		},
	    
	    delSubmit : function() {
	    	var m = $('#modal_confirm_del_user');
	    	var username= m.find('#user_del_name').val();
	    	dashApi.user_remove(username, function(ret, err) {
	    		if (ret) {
	    			m.find('#user_del_name').val('');
					m.modal('hide');
					User.showTable();
	    		} else {
					//console.log(err);
	    			alert(err.reason);
				}
			});
		},
		
		setEditDate : function(m, u) {
			var user = {
					username : '',
					remark : ''
			};
			$.extend(user, u || {});
			m.find('#user_edit_name').val(user.username);
			m.find('#user_edit_remark').val(user.remark);
			m.find('#user_edit_pwd').val('');
			m.find('#user_edit_pwd_1').val('');
		},
		
		setAddDate : function(m, u) {
			var user = {
					username : '',
					remark : ''
			};
			$.extend(user, u || {});
			m.find('#user_add_name').val(user.username);
			m.find('#user_add_remark').val(user.remark);
			m.find('#user_add_pwd').val('');
			m.find('#user_add_pwd_1').val('');
		},
		
		editPage : function(username, remark) {
	        var m = $('#modal_user_edit');
			m.modal('show');
			User.setEditDate(m,
				{username : username,
				remark : remark});
	    },
		
		editSubmit : function() {
			var user = {};
			var m = $('#modal_user_edit');
			user.user_name = $.trim(m.find('#user_edit_name').val());
			user.tags = $.trim(m.find('#user_edit_remark').val());
			user.password = $.trim(m.find('#user_edit_pwd').val());
			user.pwd_1 = $.trim(m.find('#user_edit_pwd_1').val());
			if (user.user_name == '') {
				alert("Username is required.");
				return;
			}
			if (user.password == '') {
				alert("Password is required.");
				return;
			}
			if (user.password != user.pwd_1) {
				alert("Passwords do not match.");
				return;
			}
			dashApi.user_update(user, function(ret, err) {
				if (ret) {
					User.setEditDate(m);
					m.modal('hide');
					User.showTable();
	    		} else {
					//console.log(err);
	    			alert("Edit failure.");
				}
			});
	    },
		
		addSubmit : function() {
			var user = {};
			var m = $('#modal_user_add');
			user.user_name = $.trim(m.find('#user_add_name').val());
			user.tags = $.trim(m.find('#user_add_remark').val());
			user.password = $.trim(m.find('#user_add_pwd').val());
			user.pwd_1 = $.trim(m.find('#user_add_pwd_1').val());
			if (user.user_name == '') {
				alert("Username is required.");
				return;
			}
			if (user.password == '') {
				alert("Password is required.");
				return;
			}
			if (user.password != user.pwd_1) {
				alert("Passwords do not match.");
				return;
			}
			dashApi.user_add(user, function(ret, err) {
				if (ret) {
					User.setAddDate(m);
					m.modal('hide');
					User.showTable();
	    		} else {
					//console.log(err);
	    			alert(err.reason);
				}
			});
		}
};

function showHttpApi() {
	// 标题导航条
	//$('#title_bar .description').text("HTTP API List");
	$('#title_bar .title').text("HTTP API");
	$('#title_bar .breadcrumb-env').html(
			'<ol class="breadcrumb bc-1">' +
			'<li><i class="fa-home"></i>Overview</li>' +
			'<li class="active"><strong>HTTP API</strong></li>' +
			'</ol>');

	// 加载HTTP API信息
	loading('http_api.html', function() {});
};
