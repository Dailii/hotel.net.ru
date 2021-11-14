$(function(){
	$('.select-list-frame').on('click', '.select-list', function(e){
		e.stopPropagation();

		var select = $(this).find('.select-values');
		$('.select-values').not(select).hide();
		
		var h = $(this).height();
		var w = $(this).width();
		var pl = $(this).css('padding-left');
		var pr = $(this).css('padding-right');
		var add_w = parseInt(pl)+parseInt(pr);
		w+=add_w-2;
		
		$(select).css({'top':'-'+h, 'width':w});
		
		if($(select).css('display') == 'none'){
			$(select).slideDown('fast');
		}else{
			$(select).hide();
		}
	});
	
	$('.select-list-frame').on('click', '.select-values div', function(e){
		
		var html = $(this).html();
		var val = $(this).data('val');
                
		
		var par = $(this).parent().parent();
		$(par).find('.select-list-view').html(html);
		$(par).data('val', val);
		
		var cook = $(par).data('cook');
		
		if(cook != '' && typeof(cook) != 'undefined'){
			$.cookie(cook, val, {expires: 365, path: "/" });
		}
		
		var callback = $(par).data('callback');
		
//		console.log('val', val);
		
		var callback_arr = callback.split(',');
                
                callback_arr.forEach(function(callback) {
                    callback = $.trim(callback);
                    
                    var argum = '';
                    var argum_arr = callback.split('(');
                    if(argum_arr.length > 1){
                        argum = argum_arr[1].replace(")","");
                        callback = argum_arr[0];
                    }
                    
                    if(argum == 'this') argum = par;
                    
                    //console.log('callback', callback);
                    //console.log(argum);
                    
                    if(callback == 'save_obj_id'){
                            save_obj_id();
                    }else if(callback == 'refresh'){
                            refresh();
                    }else if(callback == 'save_contact'){
                            save_contact(val, par);
                    }else if(callback == 'recalc'){
                            recalc();
                    }else if(callback == 'child_view'){
                            child_view();
                    }else if(callback == 'book_amount_rooms'){
                            book_amount_rooms();
                    }else if(callback == 'book_recalc'){
                            book_recalc(argum);
                    }else if(callback == 'book_child_view'){
                            book_child_view(argum);
                    }else if(callback == 'order_agent'){
                            order_agent(argum);
                    }else if(callback == 'chess_group_list'){
                            chess_group_list(argum);
                    }else if(callback == 'get_chess'){
                            get_chess(argum);
                    }else if(callback == 'chess_child_view'){
                            chess_child_view(argum);
                    }else if(callback == 'chess_ord_sel_room'){
                            chess_ord_sel_room(argum);
                    }else if(callback == 'chess_ord_adds'){
                            chess_ord_sel_adds(argum);
                    }else if(callback == 'chess_adds_peop'){
                            chess_adds_peop(argum);
                    }else if(callback == 'chess_sel_sale_type'){
                            chess_sel_sale_type(argum);
                    }else if(callback == 'chess_status_blank'){
                            chess_status_blank(argum);
                    }else if(callback == 'research'){
                            research(argum);
                    }
                    
                });
		
		
		
	});
	
	$(document).click(function(){
            $('.select-values').hide();
	});
	
});