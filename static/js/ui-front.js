document.addEventListener('DOMContentLoaded', () => {
  scrollAnimation();
  fixedBtn();
});

function scrollAnimation() {
  const animateElements = document.querySelectorAll('.animate-scroll, .animate-scroll2, .sticky-box .animate-on');
  const animateOnElements = document.querySelectorAll('.animate-on');
  const _Y = 50;
  const _scale = 0.3;

  function updateElementStyle(element) {
    const stickyBox = element.closest('.sticky-box');
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const windowCenter = windowHeight / 2;
    const elementCenter = rect.top + rect.height / 2;

    let progress = 1;
    if (stickyBox) {
      const stickyRect = stickyBox.getBoundingClientRect();
      if (element.classList.contains('animate-on')) {
        const inrRect = stickyBox.querySelector('.sticky-inr').getBoundingClientRect();
        if (stickyRect.top <= -(windowHeight / 4) && inrRect.top <= 0) {
          if (!element.classList.contains('on')) element.classList.add('on');
        } else {
          if (element.classList.contains('on')) element.classList.remove('on');
        }
        return;
      }

      if (stickyRect.top <= 0 && stickyRect.bottom >= windowHeight) {
        progress = Math.abs(stickyRect.top / (stickyRect.height - windowHeight));
      } else if (stickyRect.bottom < windowHeight) {
        progress = 1;
      } else {
        progress = 0;
      }
    } else {
      progress = 1 - (elementCenter - windowCenter) / (windowHeight / 2);
      progress = Math.max(0, Math.min(1, progress));
    }
    const translateY = _Y - progress * _Y;
    const scale = _scale + progress * (1 - _scale);
    const scale2 = 2 - scale;
    // const opacity = progress;

    if (element.classList.contains('animate-scroll')) {
      element.style.transform = `translateY(${translateY}px) scale(${scale})`;
      // element.style.opacity = opacity;
    }
    if (element.classList.contains('animate-scroll2')) {
      element.style.transform = `translateY(${translateY}px) scale(${scale2})`;
      // element.style.opacity = opacity;
    }
  }

  function resetElementStyle(element) {
    if (element.classList.contains('animate-on')) {
      if (element.classList.contains('on')) element.classList.remove('on');
    }
    if (element.classList.contains('animate-scroll')) {
      element.style.transform = `translateY(${_Y}px) scale(${_scale})`;
      // element.style.opacity = '0';
    }
    if (element.classList.contains('animate-scroll2')) {
      element.style.transform = `translateY(${_Y}px) scale(${1 + (1 - _scale)})`;
      // element.style.opacity = '0';
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
        const stickyBox = entry.target.closest('.sticky-box');
        if (!stickyBox) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            if (!entry.target.classList.contains('on')) {
              entry.target.classList.add('on');
            }
          } else {
            entry.target.classList.remove('on');
          }
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
}

function fixedBtn() {
  const section = document.querySelector('.section-2');
  const fixedButton = document.querySelector('.bottom-btn');

  let lastScrollY = window.scrollY; // 이전 스크롤 위치 저장

  // 타겟 요소의 위치 계산

  window.addEventListener('scroll', function () {
    const scrollY = window.scrollY;
    const scrollPosition = scrollY + window.innerHeight;
    const sectionPosition = section.getBoundingClientRect().top + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;

    // 타겟 요소가 보이기 시작하는지 확인
    // if (scrollPosition > sectionPosition + fixedButton.offsetHeight) {
    if (scrollPosition > sectionPosition) {
      fixedButton.classList.add('white');
    } else {
      fixedButton.classList.remove('white');
    }

    // 스크롤 방향에 따라 on 클래스 추가/제거
    if (scrollPosition >= documentHeight - 5) {
      // 스크롤이 페이지 마지막에 도달하면 방향 상관없이 on 클래스 추가
      fixedButton.classList.add('on');
    } else if (scrollY >= lastScrollY) {
      // 아래로 스크롤할 때
      fixedButton.classList.add('on');
    } else {
      // 위로 스크롤할 때
      fixedButton.classList.remove('on');
    }

    // 현재 스크롤 위치를 업데이트
    lastScrollY = scrollY;
  });
}
