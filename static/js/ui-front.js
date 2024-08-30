document.addEventListener('DOMContentLoaded', () => {
  const animateElements = document.querySelectorAll('.animate-scroll, .animate-scroll2');
  const animateOnElements = document.querySelectorAll('.animate-on');
  const _Y = 50;
  const _scale = 0.3;

  function updateElementStyle(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const windowCenter = windowHeight / 2;
    const elementCenter = rect.top + rect.height / 2;

    let progress = 1 - (elementCenter - windowCenter) / (windowHeight / 2);
    progress = Math.max(0, Math.min(1, progress));

    const translateY = _Y - progress * _Y;
    const scale = _scale + progress * (1 - _scale);
    const scale2 = 2 - scale;
    const opacity = progress;

    if (element.classList.contains('animate-scroll')) {
      element.style.transform = `translateY(${translateY}px) scale(${scale})`;
      element.style.opacity = opacity;
    }
    if (element.classList.contains('animate-scroll2')) {
      element.style.transform = `translateY(${translateY}px) scale(${scale2})`;
      element.style.opacity = opacity;
    }
  }

  function resetElementStyle(element) {
    if (element.classList.contains('animate-scroll')) {
      element.style.transform = `translateY(${_Y}px) scale(${_scale})`;
      element.style.opacity = '0';
    }
    if (element.classList.contains('animate-scroll2')) {
      element.style.transform = `translateY(${_Y}px) scale(${1 + (1 - _scale)})`;
      element.style.opacity = '0';
    }
  }

  const animateMeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.dataset.visible = 'true';
          updateElementStyle(entry.target);
        } else {
          entry.target.dataset.visible = 'false';
          resetElementStyle(entry.target);
        }
      });
    },
    { threshold: 0 }
  );

  const animateOnObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          if (!entry.target.classList.contains('on')) {
            entry.target.classList.add('on');
          }
        } else {
          entry.target.classList.remove('on');
        }
      });
    },
    {
      threshold: [0, 0.5, 1],
      rootMargin: '-10% 0px'
    }
  );

  animateElements.forEach((element) => {
    animateMeObserver.observe(element);
    resetElementStyle(element);
  });

  animateOnElements.forEach((element) => {
    animateOnObserver.observe(element);
  });

  function updateVisibleElements() {
    animateElements.forEach((element) => {
      if (element.dataset.visible === 'true') {
        updateElementStyle(element);
      }
    });
  }

  window.addEventListener('scroll', updateVisibleElements);
  window.addEventListener('resize', updateVisibleElements);
});
