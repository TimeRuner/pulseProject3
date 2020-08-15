
@@include('webpScript.js');
@@include('ibg.js');
@@include('jquery.maskedinput.min.js');
@@include('jquery.validate.min.js');
@@include('slick.min.js');
@@include('wow.min.js');

$(document).ready(function(){
    $('.carousel__inner').slick({
        speed: 1200,
        adaptiveHeight: true,
        // autoplay: true,
        pauseOnHover: true,
        prevArrow: '<button type="button" class="slick-prev"><img src="icons/slider/left.png"></button>',
        nextArrow: '<button type="button" class="slick-next"><img src="icons/slider/right.png"></button>',
        responsive: [
            {
                breakpoint: 1050,
                settings: {
                    dots: true,
                    arrows: false

                }
            }
           
          ]
    });
//! Jquery script для табів
    $('ul.catalog__tabs').on('click', 'li:not(.catalog__tab_active)', function() {
        $(this)
          .addClass('catalog__tab_active').siblings().removeClass('catalog__tab_active')
          .closest('div.container').find('div.catalog__content').removeClass('catalog__content_active').eq($(this).index()).addClass('catalog__content_active');
      });
//! jQuery скріпт для перемикання кнопки 'Детальніше'
    
    function toggleSlide(item){
        $(item).each(function(i){
            $(this).on('click', function(e){
                e.preventDefault();
                $('.catalog-item__content').eq(i).toggleClass('catalog-item__content_active');
                $('.catalog-item__list').eq(i).toggleClass('catalog-item__list_active');
            }) 
        })
    }
    toggleSlide('.catalog-item__link');
    toggleSlide('.catalog-item__back');


    //!Modal icons
    $('[data-modal=consultation]').on('click', function(){
        $('.overlay, #consultation').fadeIn('slow');
    });
    $('.modal__close').on('click', function(){
        $('.overlay, #consultation, #thanks, #order').fadeOut('slow');
    });
   
    $('.button_mini').each(function(i){
        $(this).on('click', function(){
            $('#order .modal__descr').text($('.catalog-item__subtitle').eq(i).text());
            $('.overlay, #order').fadeIn('slow');
        })
    });


    $('#consultation-form').validate();

   function validateForms(form){
    $(form).validate({
        rules: {
            name: 'required',
            phone: 'required',
            email: {
                required: true,
                email: true
            }
        },
        messages: {
            name: "Будь ласка, введіть ваше ім'я",
            phone: "Будь ласка, введедіть ваш телефон",
            email: {
              required: "Будь ласка, введіть вашу почту",
              email: "Неправильно введена почта"
            }
        }
    });
   }
    validateForms('#consultation-forms');
    validateForms('#consultation form');
    validateForms('#order form');

    $("input[name=phone]").mask("+38 (999) 999-9999");


    //! end page up
    $(window).scroll(function(){
        if($(this).scrollTop()>1600&&$(this).width()>=1050){
            $('.pageup').fadeIn();
        }else{
            $('.pageup').fadeOut();
        }
    });

    
    $("a[href=#up]").click(function(){
        const _href = $(this).attr("href");
        $("html, body").animate({scrollTop: $(_href).offset().top+"px"});
        return false;
    });

//! відправка даних з сайту на сервер
    $('form').submit(function(e){
        e.preventDefault();
        $.ajax({
            type: 'POST',//! Вказую, що хочу відправити дані
            url: 'mailer/smart.php',
            data: $(this).serialize()
        }).done(function(){
            $(this).find('input').val('');
            $('#consultation, #order').fadeOut();
            $('.overlay, #thanks').fadeIn('slow');
            $('form').trigger('reset');//! очищення форм після відправки
        });
        return false;
    });
    //! Аніммації
    new WOW().init();


});


