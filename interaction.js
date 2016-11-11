var interaction = (function($, window, undefined) {
    return {
        init: function(){
            interaction.make_checks();
            interaction.make_things_hidden();
            interaction.masonry();
            interaction.make_things_clickable();
            interaction.check_for_placement();
            interaction.assess_size();
            interaction.setup_resize();
            interaction.setup_colorbox();
            interaction.set_timer();
            interaction.watch_arrows();
            interaction.check_photo_width();
        },
        masonry: function(){
            $('#main_gallery').masonry({
                itemSelector: '.photo'
            });
        },
        make_things_hidden: function(){
            $('#scroll_top').hide();
            $('#small_logo').hide();
            $('#photo_slide').css({
                'opacity': 0,
                'left': '-9999px'
            });
        },
        reload_masonry: function(){
            $('#main_gallery').masonry('reload');
        },
        make_checks: function(){

        },
        load_next_chunk_of_forever: function(){
            var next_page = $('#load_more').attr('href');
            next_page = parseInt(next_page.split('_')[1]);
            next_page = next_page + 19;
            var next_url = 'page_' + next_page;
            $('#load_more').addClass('loading');
            $('#load_more').attr('href', next_url)
            $.get("loader.php", {
                    page: next_page
                },
                function(data){
                    var $boxes = $(data);
                    $('#main_gallery').append( $boxes ).masonry('appended', $boxes, !0);
                    interaction.setup_colorbox();
                    interaction.check_for_placement();
                    var new_href = '#page_' + (next_page);
                    $('#load_more').attr('href', new_href);
                    $('#load_more').removeClass('loading');
                    if ($('#stopper').length){
                        $('#load_more').hide();
                    }
                });
        },
        load_next_photo: function(){
            var this_loaded_photo = $('.photo.lightboxed');
            var next_photo = $(this_loaded_photo).next('.photo').addClass('loading_next');
            if ($('.loading_next').length) {
                interaction.load_photo();
            }
        },
        load_previous_photo: function(){
            var this_loaded_photo = $('.photo.lightboxed');
            var next_photo = $(this_loaded_photo).prev('.photo').addClass('loading_next');
            if ($('.loading_next').length) {
                interaction.load_photo();
            }
        },
        load_photo: function(){
            $('.lightboxed').removeClass('lightboxed');
            $('.loading_next').addClass('lightboxed').removeClass('loading_next');
            $('.lightboxed a').click();
        },
        setup_colorbox: function(){
            var screen_width = parseInt($(window).width());
            $('#gallery .icon_zoom').click(function(){
                if (screen_width > 500) {
                    var photo_to_show = '#' + $(this).attr('data-target');
                    $(photo_to_show).click();
                    return false;
                }
            });
            $('#gallery .photo_shell a').unbind('click');
            $('#gallery .photo_shell a').bind('click', function(){

                var screen_width = parseInt($(window).width());
                var screen_height = parseInt($(window).height());
                if (screen_width > 500) {
                    $('.photo').removeClass('lightboxed');
                    $(this).parent('.photo_shell').parent('.photo').addClass('lightboxed');
                    var photo_location = $(this).parent('.photo_shell').parent('.photo').index();
                    photo_location = parseInt(photo_location) + 1;
                    var image_title = $(this).attr('title');
                    var this_url = $(this).attr('href');
                    var height_and_width = '&h=' + screen_height + '&w=' + screen_width;
                    this_url = this_url + '&p=1' + height_and_width;
                    var new_url = this_url + ' #lightbox_view';
                    var number_of_photos = $('.photo').length;
                    number_of_photos = parseInt(number_of_photos);
                    var image_width = $('#holder #lightbox_view img').attr('width');
                    var image_height = $('#holder #lightbox_view img').attr('height');
                    var lightbox_title_height = $('#lightbox_view .photo_details').height();
                    var image_combined_height = image_height + parseInt(lightbox_title_height);
                    var screen_adjusted_height = screen_height * .9;
                    var adjusted_without_title = screen_adjusted_height - lightbox_title_height;
                    $.colorbox({
                        href: new_url,
                        maxHeight: '90%',
                        maxWidth: '90%'
                    }, function(){
                        $('.photo_location').html(photo_location);
                        $('.photo_count').html(number_of_photos);
                        var nav_icons_width = parseInt($('#colorbox .nav_icons').width());
                        var colorbox_width = parseInt($('#colorbox').width());
                        var adjusted_nav_icons_margin = (colorbox_width / 2) - (nav_icons_width / 2);
                        $('#lightbox_view .width_50').css({
                            'max-width': adjusted_nav_icons_margin
                        });
                    });
                    return false;
                }
            });
        },
        make_things_clickable: function(){
            $('#load_more').click(function(){
                interaction.load_next_chunk_of_forever();
                return false;
            });
            $('#scroll_top').click(function(){
                $('body,html').animate({
                    scrollTop: 0
                }, 500);
                return false;
            });
            $('.map_image').click(function(e){
                var image = $(this).attr('href');
                var image_height = $(this).attr('data-height');
                var image_width = $(this).attr('data-width');
                if (image_width > image_height) {
                    var ratio = image_width / image_height;
                    var thumb_width = 240;
                    var thumb_height = 240 / ratio;
                } else if (image_height > image_width) {
                    ratio = image_height / image_width;
                    thumb_height = 240;
                    thumb_width = 240 / ratio;
                } else if (image_height == image_width) {
                    ratio = 1;
                    thumb_width = 240;
                    thumb_height = 240;
                }
                var click_x = e.pageX;
                var title = $(this).attr('alt');
                var image_markup = '<img src="' + image + '" alt="' + title + '" height="' + thumb_height + '" width="' + thumb_width + '" />';
                $('#photo_slide_image').html(image_markup);
                var slide_height = parseInt($('#photo_slide').height());
                var slide_width = parseInt($('#photo_slide').width());
                var slider_height = parseInt($('#linear_gallery').height());
                var screen_width = $('window').width();
                if (screen_width > 500) {
                    var new_top = (slide_height  + slider_height + 55) * -1 + 'px';
                } else {
                    new_top = (slide_height + slider_height + 35) * -1 + 'px';
                }
                var new_left = click_x - (slide_width / 2) + 'px';
                $('#photo_slide').animate({
                    'margin-top': new_top,
                    'left': new_left,
                    'opacity': 1
                },300);
                return false;
            });
            var screen_width = parseInt($(window).width());
            var pager_width = parseInt($('#linear_gallery_right').width()) * 2;
            var remaining_width = screen_width - pager_width;
            var number_of_visible = ((remaining_width) / 50) - 5;
            $('#linear_gallery_right').click(function(){
                $('#photo_slide').animate({
                    'opacity': 0,
                    'left': '-9999px',
                }, 100);
                var gallery_offset = parseInt($('#carousel').css('margin-left'));
                var new_offset = gallery_offset - (number_of_visible * 50) + 'px';
                var max_width = $('.map_image').length * 50;
                if (gallery_offset < max_width) {
                    $('#carousel').animate({
                        'margin-left': new_offset
                    }, 300);
                }
                return false;
            });
            $('#linear_gallery_left').click(function(){
                $('#photo_slide').animate({
                    'opacity': 0,
                    'left': '-9999px'
                }, 300);
                var gallery_offset = parseInt($('#carousel').css('margin-left'));
                if (gallery_offset < 0) {
                    var new_offset = gallery_offset + (number_of_visible * 50) + 'px';
                    $('#carousel').animate({
                        'margin-left': new_offset
                    }, 100);
                }
                return false;
            });
            $('#photo_slide').click(function(){
                $('#photo_slide').animate({
                    'opacity': 0,
                    'left': '-9999px'
                }, 300);
            });
        },
        watch_arrows: function(){
            $(window).keyup(function(event){
                if (event.keyCode == 37) {
                    if ($('#colorbox').is(':visible')) {
                        interaction.load_previous_photo();
                        return false;
                    }
                } else if (event.keyCode == 39) {
                    if ($('#colorbox').is(':visible')) {
                        interaction.load_next_photo();
                        return false;
                    }
                }
            });
        },
        watch_scrolltop: function(){
            var current_scrolltop = parseInt($(window).scrollTop());
            var window_height = parseInt($(window).height());
            if (current_scrolltop > window_height) {
                $('#scroll_top').fadeIn();
                $('#small_logo').fadeIn();
            } else {
                $('#scroll_top').fadeOut();
                $('#small_logo').fadeOut();
            }
        },
        check_for_placement: function(){
            $('#load_more').appear(function() {
                interaction.load_next_chunk_of_forever();
            });
        },
        assess_size: function(){
            var window_width = parseInt($(window).width());
            $('body').removeClass('width_1300').removeClass('width_1600').removeClass('width_1900');
            if (window_width > 1300 & window_width < 1620) {
                $('body').addClass('width_1300');
            } else if (window_width > 1620) {
                $('body').addClass('width_1600');
            }
            interaction.reload_masonry();
        },
        setup_resize: function(){
            $(window).resize(function(){
                var starting_class = $('body').attr('class');
                var window_width = parseInt($(window).width());
                $('body').removeClass('width_1300').removeClass('width_1600').removeClass('width_1900');
                if (window_width > 1300 & window_width < 1620) {
                    $('body').addClass('width_1300');
                } else if (window_width > 1620) {
                    $('body').addClass('width_1600');
                }
                var now_class = $('body').attr('class');
                interaction.reload_masonry();
            });
        },
        on_increment: function(){
            interaction.watch_scrolltop();
        },
        set_timer: function(){
            setInterval("interaction.on_increment()", 500);
        },
        check_photo_width: function(){
            var screen_width = parseInt($(window).width());
            if (screen_width < 500) {
                $('#lightbox_view img').attr('style', '');
                $('#lightbox_view').attr('style', '');
            }
        }
    };
})(jQuery, this);

$('document').ready(function(){
    interaction.init();
});