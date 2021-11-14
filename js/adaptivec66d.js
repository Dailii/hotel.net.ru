room_swiper = '';

$(function(){
    window.onresize = function(event) {
        mob_top_menu();
        main_room_w();
        to_top_design();
        room_swip();
    };
    
    
    $('#mob-top-menu-btn').click(function(){
        $(this).toggleClass('open');
        var links = $('#top-menu-list').html();
        var addr = $('#addr-only').html();
        
        if($(this).hasClass('open')){
            $('#mob-popup-menu').show();
            $('#black-sc').show();
            
            $('#mob-menu-links').html(links);
            $('#mob-menu-addr').html(addr);
        }else{
            $('#mob-popup-menu').hide();
            $('#black-sc').hide();
        }
    });
    
    
    
    
    window.onresize();
});

function mob_top_menu(){
    var head_h = parseInt($('#main-photo-list img').height());
    if(head_h < 160) head_h = 160;
    if(head_h > 600) head_h = 600;
    $('#main-photo, #main-photo-list, #main-photo-left, #main-photo-right').height(head_h);
    console.log('mot-top-menu');
}

function main_room_w(){
    var w = parseInt($('.center').eq(0).width());
    console.log('main-room-w', w);
    var woi = parseInt($('#main-rooms-over-in').width());
    $('#main-rooms-over-in').data('w', woi);
    
    if(w < 700){
        //$('.main-room').width(w);
        $('#main-rooms-over-in').css('width', 'inherit');
    }else{
        $('.main-room').width(226);
        
        var w = parseInt($('#main-rooms-over-in').data('w'));
        $('#main-rooms-over-in').width(w);
    }
}

function to_top_design(){
    var w = parseInt($('.center').eq(0).width());
    if(w < 964){
        $('#toTop').addClass('to-top-mob');
        $('#toTop').html('^');
    }else{
        $('#toTop').removeClass('to-top-mob');
        $('#toTop').html('^ Наверх');
    }
    
}

function room_swip(){
    var w = parseInt($('.center').eq(0).width());
    var exist = $('.swiper-container').eq(0).length;
    
    if(room_swiper != '' && exist > 0) room_swiper.destroy(true, true);
    
    if(w < 700){
        room_swiper = new Swiper('.swiper-container', {
          navigation: {
            nextEl: '#mob-rooms-r',
            prevEl: '#mob-rooms-l',
          },
        });
    }
}








