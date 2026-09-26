(function(){
  function pad(value){
    return String(value).padStart(2,'0');
  }

  function bootRefineProgramCarousel(){
    document.querySelectorAll('[data-program-carousel]').forEach(function(root){
      var track = root.querySelector('[data-program-track]');
      var prev = root.querySelector('[data-program-prev]');
      var next = root.querySelector('[data-program-next]');
      var count = root.querySelector('[data-program-count]');
      var cards = Array.prototype.slice.call(root.querySelectorAll('.r-program-card'));
      if(!track || !cards.length) return;

      function nearestIndex(){
        var left = track.scrollLeft;
        var maxScroll = Math.max(0,track.scrollWidth-track.clientWidth);
        if(left <= 4) return 0;
        if(maxScroll-left <= 4) return cards.length-1;
        var closest = 0;
        var distance = Infinity;
        cards.forEach(function(card,index){
          var d = Math.abs(card.offsetLeft-left);
          if(d < distance){
            distance = d;
            closest = index;
          }
        });
        return closest;
      }

      function updateCount(){
        if(!count) return;
        count.textContent = pad(nearestIndex()+1) + ' / ' + pad(cards.length);
      }

      function goTo(index){
        var target = (index + cards.length) % cards.length;
        track.scrollTo({left:cards[target].offsetLeft,behavior:'smooth'});
      }

      if(prev) prev.addEventListener('click',function(){ goTo(nearestIndex()-1); });
      if(next) next.addEventListener('click',function(){ goTo(nearestIndex()+1); });
      track.addEventListener('scroll',function(){ window.requestAnimationFrame(updateCount); },{passive:true});
      track.addEventListener('keydown',function(event){
        if(event.key === 'ArrowLeft'){
          event.preventDefault();
          goTo(nearestIndex()-1);
        }
        if(event.key === 'ArrowRight'){
          event.preventDefault();
          goTo(nearestIndex()+1);
        }
      });
      window.addEventListener('resize',updateCount,{passive:true});
      updateCount();
    });
  }

  function bootRefineJournalCarousel(){
    if(!window.jQuery || !jQuery.fn || !jQuery.fn.owlCarousel) return;
    var $carousel = jQuery('.js-refine-journal-carousel');
    if(!$carousel.length || $carousel.hasClass('owl-loaded')) return;
    $carousel.owlCarousel({
      loop:true,
      margin:24,
      nav:true,
      dots:true,
      autoplay:true,
      autoplayTimeout:4600,
      autoplaySpeed:750,
      smartSpeed:750,
      autoplayHoverPause:true,
      mouseDrag:true,
      touchDrag:true,
      pullDrag:true,
      navSpeed:650,
      dotsSpeed:650,
      navText:['<span aria-hidden="true">←</span>','<span aria-hidden="true">→</span>'],
      responsive:{
        0:{items:1,margin:14,stagePadding:26},
        560:{items:1,margin:18,stagePadding:80},
        760:{items:2,margin:18,stagePadding:0},
        1100:{items:3,margin:24,stagePadding:0}
      },
      onInitialized:function(){
        var $root=this.$element;
        $root.attr('data-carousel-ready','true');
        $root.find('.owl-prev').attr('aria-label','이전 블로그 글');
        $root.find('.owl-next').attr('aria-label','다음 블로그 글');
        $root.find('.owl-dot').each(function(i){ jQuery(this).attr('aria-label',(i+1)+'번째 블로그 슬라이드'); });
      },
      onRefreshed:function(){
        var $root=this.$element;
        $root.find('.owl-prev').attr('aria-label','이전 블로그 글');
        $root.find('.owl-next').attr('aria-label','다음 블로그 글');
      }
    });
  }

  function boot(){
    bootRefineProgramCarousel();
    bootRefineJournalCarousel();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded',boot,{once:true});
  }else{
    boot();
  }
})();
