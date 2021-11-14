$(function(){
	$.getScript("js/select_list.js");
	
	$.datepicker.setDefaults($.datepicker.regional['ru']);
	
	$('.inp-date-s').datepicker({
			dateFormat:'d MM                                             y',  
			minDate: 0,
			onSelect: function(dateText, inst) {
				save_date_s(this);
				var d = $(this).datepicker("getDate");
				var setDateE = nextDate(this);
				$(".inp-date-e").datepicker( "option", "minDate", new Date(d.getFullYear(), d.getMonth(), d.getDate()+1));
				$(".inp-date-e").datepicker('setDate', setDateE);
				save_date_e($(".inp-date-e" ));
				callbacks(this);
			}
	});
	
	$('.inp-date-e').datepicker({
			dateFormat:'d MM                                             y',  
			minDate: 1,
			onSelect: function(dateText, inst) {
				save_date_e(this);
				callbacks(this);
			}
	});
        
        
        
        $('.page-chess-month').click(function(){
           $('.page-chess-month').removeClass('page-chess-month-ac');
           $(this).addClass('page-chess-month-ac');
           
           var d = $(this).data('d')*30;
           
           $('#page-chess-right').animate({scrollLeft: d}, 300);
        });
        
        $('#page-chess-right').scroll(function () {
            var val = $(this).scrollLeft();
            
            $('.page-chess-month').each(function(index, element) {
               var d = $(this).data('d')*30 - 150;
               
               console.log(val, d);
               
               if(val > d){
                    $('.page-chess-month').removeClass('page-chess-month-ac');
                    $(this).addClass('page-chess-month-ac');
               }
                
            });
	});
		
	
        $('.book-adds input').change(function(){
           var id = $(this).data('id');
           var check = $(this).prop("checked");
           
           if(check == true){
               $.cookie("adds["+id+"]", 1, {expires: 365, path: "/" });
           }else{
               $.cookie("adds["+id+"]", null, {expires: 365, path: "/" });
           }
        });
        
        
        //room img slide BEGIN
        $('#room-photo-btns').on('mouseenter', 'span', function(){
            $(this).css('background-position', '-500px 0px');
        }).on('mouseleave', 'span', function(){
            if($(this).attr('ac') != 1) $(this).css('background-position', '-544px 0px');
        });
        
        $('#room-photo-r').click(function(){
            var n = $('#room-photo-img').data('n');
            set_btn_img_room(n, 1);
        });
        
        $('#room-photo-l').click(function(){
            var n = $('#room-photo-img').data('n');
            set_btn_img_room(n, 0);
        });
        
        $('#room-photo-btns span').click(function(){
            var n = $(this).data('n');
            set_btn_img_room(n, 2)
        });


    $('#main-landing-send').click(function(){
        var val = $('#main-landing-input').val();
        var text = $(this).data('text');
        
        
        
        
        if(val == ''){
            $('#main-landing-input').focus();
            alert('Введите телефон либо e-mail, пожалуйста. ');
        }else{
            $('#main-landing-send').html('<img src="img/load10.gif" />');
            
            var phone = '';
            var email = '';
            
            if(val.indexOf('@') > 0){
               email = val; 
            }else{
                phone = val;
            }
            
            $.post('ajax-new-ord.html', {landing:1, order:1, phone:phone, email:email}, function(data){
                console.log(data);
                alert('Ваша заявка отправлена');
                $('#main-landing-send').html(text);
            });
        }
        
    });
	
});

$(function(){
	date_set();
        child_view();
});


function set_btn_img_room(n, move){
    var max = $('#room-photo-btns span').length; 
    console.log('max', max);
    if(move == 1){
        n++;
        if(n > max) n=1;
    }else if(move == 0){
        n--;
        if(n < 1) n = max;
    }

    var src = $('#room-photo-btns span').eq((n-1)).data('img');
    var img = '<img style="width:100%" src="'+src+'" />';

    $('#room-photo-img').data('n', n);
    $('#room-photo-img').html(img);

    $('#room-photo-btns span').css('background-position', '-544px 0px').attr('ac', 0);
    $('#room-photo-btns span').eq((n-1)).css('background-position', '-500px 0px').attr('ac', 1);

}



function callbacks(t){
	t = $(t).eq(0);
	var callback = $(t).data('callback');
	
	
	if(callback != '' && callback != null){
		var callback_arr = callback.split(',');
                
                callback_arr.forEach(function(callback) {
                    callback = $.trim(callback);
                    
                    var argum = '';
                    var argum_arr = callback.split('(');
                    if(argum_arr.length > 1){
                        argum = argum_arr[1].replace(")","");
                        callback = argum_arr[0];
                    }
                    
                    //console.log(callback, argum);
                    
                    if(callback == 'recalc'){
                            recalc();
                    }else if(callback == 'book_recalc'){
                        book_recalc(argum);
                    }else if(callback == 'main_recalc'){
                        main_recalc(argum);
                    }else if(callback == 'room_chess'){
                        room_chess(argum);
                    }else if(callback == 'research'){
                        research(argum);
                    }
		});
	}
	
}

function book_child_view(n){
    var t = $('.book-room-n[data-n='+n+']');
    var childs = $(t).find('.book-inp-child').data('val');
    
    if(childs > 0){
        $(t).find('.child-title').show();
    }else{
        $(t).find('.child-title').hide();
    }
    
    $(t).find('.sel-child').hide();
    
    for(var i=1; i<=childs; i++){
        $(t).find('.book-inp-ch'+i).show();
    }
}

function main_recalc(){
    var id_rooms  = [];
    $('.calc-room').each(function(index, element) {
            var id = $(this).data('id');
            id_rooms[index] = id;
    });

    $('.load-cost').html('<img src="img/load10.gif" />');
    $('.calc-sale').hide();
    
    var hvlogin = $('body').data('login');
    

    $.getJSON('module/cost.html',{'id_rooms[]':id_rooms, 'get_json':1, hvlogin:hvlogin}, function(data){
            console.log(data);
            $('.calc-room').each(function(index, element) {
                    var id = $(this).data('id');
                    $(this).data('price', data.price_tab[id]);

                    try {
                        $(this).find('.calc-sale-day').html(data.min_sale_cost[id]+'<b></b>');
                        $(this).find('.calc-sale-all').html(data.sale_all[id]);
                        $(this).find('.calc-pay_stay').html(data.pay_stay[id]+' '+data.curr_full);
                        $(this).find('.calc-prepay-text').html(data.prepay_text);
                        $(this).find('.calc-prepay-sum').html(data.prepay_sum[id]+' '+data.curr_full);
                        $(this).find('.calc-cost-all').html(data.cost_all[id]+' '+data.curr_full);
                        $(this).find('.calc-cost-day').html(data.min_from[id]+' '+data.min_cost[id]+' '+data.curr_full);
                        $(this).find('.calc-people').html(data.people);
                        $(this).find('.calc-room-places').html(data.room_places[id]);
                        $(this).find('.calc-days-text').html(data.days_text);
                        $(this).find('.calc-date-text').html(data.date_text);
                        $(this).find('.calc-pay-type').html(data.pay_type);

                        if(data.sale_exitst[id] == 1){
                            $(this).find('.calc-sale').show();
                        }
                    } catch(e) {

                    }

            });
    });
}

function recalc(){
	var id_rooms  = [];
	$('.calc-room').each(function(index, element) {
		var id = $(this).data('id');
		id_rooms[index] = id;
	});
        
        var hvlogin = $('body').data('login');
	
	$('.load-cost').html('<img src="img/load10.gif" />');
        $('.calc-sale').hide();
	
	$.getJSON('module/cost.html',{'id_rooms[]':id_rooms, 'get_json':1, hvlogin:hvlogin}, function(data){
		console.log(data);
		$('.calc-room').each(function(index, element) {
			var id = $(this).data('id');
			//$(this).data('price', data.price_tab[id]);
                        
			try {
                            $(this).find('.calc-sale-day').html(data.min_sale_cost[id]+'<b></b>');
                            $(this).find('.calc-sale-all').html(data.sale_all[id]);
                            $(this).find('.calc-pay_stay').html(data.pay_stay[id]+' '+data.curr_full);
                            $(this).find('.calc-prepay-text').html(data.prepay_text);
                            $(this).find('.calc-prepay-sum').html(data.prepay_sum[id]+' '+data.curr_full);
                            $(this).find('.calc-cost-all').html(data.cost_all[id]+' '+data.curr_full);
                            $(this).find('.calc-cost-day').html(data.min_from[id]+' '+data.min_cost[id]+' '+data.curr_full);
                            $(this).find('.calc-people').html(data.people);
                            $(this).find('.calc-room-places').html(data.room_places[id]);
                            $(this).find('.calc-days-text').html(data.days_text);
                            $(this).find('.calc-date-text').html(data.date_text);
                            $(this).find('.calc-pay-type').html(data.pay_type);
                            
                            if(data.sale_exitst[id] == 1){
                                $(this).find('.calc-sale').show();
                            }
			} catch(e) {
				
			}
			
		});
	});
}


function research(){
    $('#search-content').html('<div align="center" style="width:716px;"><img src="img/load5.gif"></div>');
    $.post('search.html', {search:1}, function(data){
        $('#search-content').html(data);
    });
}


function room_chess(){
    var date = new Date($.cookie('date_s'));
    
    var date_s =  new Date($('.calend-month').eq(0).data('date'));
    var date_e =  new Date($('.calend-month').eq(-1).data('date'));
    
    if(date < date_s || date > date_e){
        room_chess_load(1);
        
        var id_room = $('#room-chess').data('id_room');
        $.post('module/calend.html', {ajax:1, get_chess:1, date:date, id_room:id_room}, function(data){
            $('#room-chees-months-scroll').html(data);
            room_chess_load(0);
        });
    }
    
}



function date_set(){
	$('.inp-date-s').each(function(index, element) {
		var d = new Date($.cookie('date_s'));
		$(this).datepicker('setDate', d);
		$(".inp-date-e").datepicker( "option", "minDate", new Date(d.getFullYear(), d.getMonth(), d.getDate()+1));
	});
	
	$('.inp-date-e').each(function(index, element) {
		$(this).datepicker('setDate', new Date($.cookie('date_e')));
	});
}

function save_date_s(t){
	t = $(t).eq(0);
	var d = $(t).datepicker( "getDate" );
	
	if(d instanceof Date && !isNaN(d.valueOf())){
		var cook_date_s = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
		$.cookie("date_s", cook_date_s, {expires: 365, path: "/" });
	}
}

function save_date_e(t){
	t = $(t).eq(0);
	var d = $(t).datepicker( "getDate" );
	
	if(d instanceof Date && !isNaN(d.valueOf())){
		var cook_date_e = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
		$.cookie("date_e", cook_date_e, {expires: 365, path: "/" });
	}
}

function nextDate(t){
	var d = $(t).datepicker( "getDate" );
	if(d instanceof Date && !isNaN(d.valueOf())){
		var cook_date_e = new Date(d.getFullYear(), d.getMonth(), d.getDate()+7);
		return cook_date_e;
	}
}

function child_view(){
    var n = $.cookie('children');
    $('.sel-child').hide();
    
    if(n>0){
        $('.childs-tip').show();
    }else{
        $('.childs-tip').hide();
    }
    
    for(i=1; i<=n; i++){
        $('.sel-child[data-n='+i+']').show();
    }
}

function book_amount_rooms(){
    var n = $('#book-amount-rooms').data('val');
    var r_frame = '';
    
    for(var i=1; i<=n; i++){
        r_frame += '<div data-calc="0" data-n="'+i+'" class="book-room-checkout mt30"><div class="book-room-checkout-title">Номер '+i+'</div><div class="book-room-content"></div></div>';
    }
    
    $('#book-right-res').html(r_frame);
    
    if(n > 1){
        $('.book-room-checkout-title').show();
    }else{
        $('.book-room-checkout-title').hide();
    }
    
    
    $('#book-rooms').html('<img src="img/load10.gif" />');
    
    var hvlogin = $('body').data('login');
    
    $.post('book.html', {get_amount_rooms:1, n:n, hvlogin:hvlogin}, function(data){
        $('#book-rooms').html(data);
        book_date_init();
        book_date_set();
        book_calc_all();
    });
}

function book_calc_all(){
    var n = $('#book-amount-rooms').data('val');
    if(n > 0 && n <50){
        for(var i=1; i<=n; i++){
            book_recalc(i);
            book_child_view(i);
        }
    }else{
        alert('Ошибка: неправильное количество номеров');
        top.location = top.location;
    }
    
}

function book_calc_sum(){
    var n = $('#book-amount-rooms').data('val');
    var calc_do = 1;
    var sum = 0;
    var prepay_name = '';
    var prepay_sum = 0;
    var curr_full = '';
    
    if(n > 0 && n <50){
        for(var i=1; i<=n; i++){
            var calc = $('.book-room-checkout[data-n='+i+']').data('calc');
            console.log('calc', i, calc);
            if(calc == 0) calc_do = 0;
        }
        
        if(calc_do == 1){
            for(var i=1; i<=n; i++){
                var t = $('.book-room-checkout[data-n='+i+']');
                sum += parseInt($(t).find('.calc-cost-all span').text());
                prepay_name = $(t).find('.calc-cost-all').data('prepay_name');
                prepay_sum += $(t).find('.calc-cost-all').data('prepay_sum');
                curr_full = $(t).find('.calc-cost-all').data('curr_full');
            }
            
            var elem = $('#book-right-sum');
            load_elem(elem);
            
            $.post('book.html', {get_sum:1, amount:n, curr_full:curr_full, prepay_name:prepay_name, prepay_sum:prepay_sum, sum:sum}, function(data){
                $(elem).html(data);
            });
        }
    }else{
        alert('Ошибка: неправильное количество номеров');
        top.location = top.location;
    } 
}

function book_recalc(n){
    var t = $('.book-room-n[data-n='+n+']');
    var checkout = $('.book-room-checkout[data-n='+n+']')
    $(checkout).data('calc', 0);
    
    var id_room = $(t).find('.book-inp-room').data('val');
    var room_name = $(t).find('.book-inp-room .select-list-view').text();
    var d1 = $(t).find('.book-date-s').datepicker("getDate");
    var n_month = parseInt(d1.getMonth())+1;
    if(n_month == 12) n_month = 1;
    var date_s = d1.getFullYear()+'-'+n_month+'-'+d1.getDate();
    var d2 = $(t).find('.book-date-e').datepicker("getDate");
    n_month = parseInt(d2.getMonth())+1;
    if(n_month == 12) n_month = 1;
    var date_e = d2.getFullYear()+'-'+n_month+'-'+d2.getDate();
    var time1 = $(t).find('.book-time1').data('val');
    var time2 = $(t).find('.book-time2').data('val');
    var adults = $(t).find('.book-inp-adults').data('val');
    var child = $(t).find('.book-inp-child').data('val');
    var ch1 = $(t).find('.book-inp-ch1').data('val');
    var ch2 = $(t).find('.book-inp-ch2').data('val');
    var ch3 = $(t).find('.book-inp-ch3').data('val');
    var ch4 = $(t).find('.book-inp-ch4').data('val');

    var hvlogin = $('body').data('login');
    
    $('.book-room-checkout[data-n='+n+'] .book-room-content').html('<img src="img/load10.gif" />');
    
    $.post('ajax-book-calc-room.html', {hvlogin:hvlogin, id_room:id_room, room_name:room_name, n:n, date_s:date_s, date_e:date_e, time1:time1, time2:time2, adults:adults, child:child, ch1:ch1, ch2:ch2, ch3:ch3, ch4:ch4}, function(data){
        $('.book-room-checkout[data-n='+n+'] .book-room-content').html(data);
        $(checkout).data('calc', 1);
        book_calc_sum();
    });
}

function book_date_init(){
    $('.book-date-s').datepicker({
                    dateFormat:'d MM                                             y',  
                    minDate: 0,
                    onSelect: function(dateText, inst) {
				book_save_date_s(this);
                                var n = $(this).data('n');
                                
				var d = $(this).datepicker("getDate");
				var setDateE = nextDate(this);
				$(".book-date-e[data-n="+n+"]").datepicker( "option", "minDate", new Date(d.getFullYear(), d.getMonth(), d.getDate()+1));
				$(".book-date-e[data-n="+n+"]").datepicker('setDate', setDateE);
				book_save_date_e($(".book-date-e[data-n="+n+"]" ));
				callbacks(this);
                    }
    });

    $('.book-date-e').datepicker({
                    dateFormat:'d MM                                             y',  
                    minDate: 1,
                    onSelect: function(dateText, inst) {
				book_save_date_e(this);
				callbacks(this);
                    }
    });
}

function book_date_set(){
	$('.book-date-s').each(function(index, element) {
                var n = $(this).data('n');
                
                if($.cookie("book_date_s["+n+"]") != null){
                    var d = new Date($.cookie("book_date_s["+n+"]"));  
                }else{
                    var d = new Date($.cookie('date_s'));

       				var cook_date_s = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
					$.cookie("book_date_s["+n+"]", cook_date_s, {expires: 365, path: "/" });
                }
                
		$(this).datepicker('setDate', d);
		$(".book-date-e[data-n="+n+"]").datepicker( "option", "minDate", new Date(d.getFullYear(), d.getMonth(), d.getDate()+1));
	});
	
	$('.book-date-e').each(function(index, element) {
                var n = $(this).data('n');
                
                if($.cookie("book_date_e["+n+"]") != null){
                    var d = new Date($.cookie("book_date_e["+n+"]"));  
                }else{
                    var d = new Date($.cookie('date_e'));
					
					var cook_date_e = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
					$.cookie("book_date_e["+n+"]", cook_date_e, {expires: 365, path: "/" });
                }
                
		$(this).datepicker('setDate', d);
	});
}

function book_save_date_s(t){
    t = $(t).eq(0);
    var d = $(t).datepicker( "getDate" );
    var n = $(t).data('n');

    if(d instanceof Date && !isNaN(d.valueOf())){
        var cook_date_s = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
        $.cookie("book_date_s["+n+"]", cook_date_s, {expires: 365, path: "/" });
    }
}

function book_save_date_e(t){
	t = $(t).eq(0);
	var d = $(t).datepicker( "getDate" );
        var n = $(t).data('n');
	
	if(d instanceof Date && !isNaN(d.valueOf())){
		var cook_date_e = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
		$.cookie("book_date_e["+n+"]", cook_date_e, {expires: 365, path: "/" });
	}
}

function load_elem(t){
    $(t).html('<img src="img/load10.gif" />');
}


(function($) {
    var defaults = {step:1};
	
    var methods = {
        init:function(params) {
            
            obj = this;
			
            var options = $.extend({}, defaults, params);
            var init = $(this).data('photo_gallery');
			
            photo_step = options.step;

            function hotel_img_btns(step, cur_obj){
                    step--;
                    var path_arr = (options.img[step]).split('index.html');
                    var last = path_arr.length-1;
                    var file = path_arr[last];
                    $(cur_obj).find('.hotel-review-gallery-img').html('<img src="/img/review/medium/'+file+'" />');
                    ac_btns(step, cur_obj);
            }

            function ac_btns(step, cur_obj){
                $(cur_obj).find('.gallery-img-btns span').css('background-position', '-646px -296px');
                $(cur_obj).find('.gallery-img-btns span').eq(step).css('background-position', '-600px -300px');	
            }
			

            if(init) {
                return this;
            }else{
                photo_step = options.step;
                $(this).show();
                var img_max = options.img.length;
                $(this).data('photo_gallery', true);
                var elem = options.step - 1;
                var path_arr = (options.img[elem]).split('index.html');
                var last = path_arr.length-1;
                var file = path_arr[last];
                var btns = '<div class="gallery-img-btns">'+str_repeat('<span></span>', img_max)+'</div>';
                var cur_img = '<div class="hotel-review-gallery-img"><img src="/img/review/medium/'+file+'" /></div>';
                var left_right_btn = '<div class="gallery-img-btn-l"><span></span></div><div class="gallery-img-btn-r"><span></span></div>';
                $(obj).html(cur_img+left_right_btn+btns);
				
                ac_btns((photo_step-1), obj);

                $(obj).find('.gallery-img-btn-r').bind({
                    mouseenter: function(e) {
                            $(this).find('span').show();
                    },
                    mouseleave: function(e) {
                            $(this).find('span').hide();
                    },
                    click: function(e) {
                        photo_step++;
                        if(photo_step > img_max) photo_step = 1;
                        var t = $(this).parent();
                        hotel_img_btns(photo_step, t);
                    }
                });
				
                $(obj).find('.gallery-img-btn-l').bind({
                    mouseenter: function(e) {
                            $(this).find('span').show();
                    },
                    mouseleave: function(e) {
                            $(this).find('span').hide();
                    },
                    click: function(e) {
                            photo_step--;
                            if(photo_step <= 0) photo_step = img_max;
                            var t = $(this).parent();
                            hotel_img_btns(photo_step, t);

                    }
                });

                $(obj).find('.gallery-img-btns span').bind({
                    click: function(e) {
                            var spans = $(this).parent().find('span');
                            photo_step = spans.index(this)+1;
                            var step = spans.index(this)+1;
                            var t = $(this).parent().parent();
                            hotel_img_btns(step, t);
                    }
                });


            }
        },
        destroy:function() {
			return $(this).unbind(".photo_gallery").data('photo_gallery', false);
        },
        close_other:function() {
            var open_gal = $('.hotel-review-gallery').filter(function() { return $(this).data('photo_gallery')==true; } );
            $(open_gal).parent().find('.hotel-review-photo-close').click();
        }
    };

    $.fn.photo_gallery = function(method){
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || !method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error('метод "' +  method + '" не найден в photo_gallery');
        }
    };
    
    function str_repeat ( input, multiplier ) {	
	var buf = '';
	for (i=0; i < multiplier; i++){
		buf += input;
	}
	return buf;
    }
})(jQuery);