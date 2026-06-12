
const tap: number = parseInt(window.location.search.split('t=')[1] || '0');

// Elementos
const tabs = [
  { btn: document.getElementById('tab-products') as HTMLButtonElement, section: document.getElementById('products-section') as HTMLDivElement },
  { btn: document.getElementById('tab-users') as HTMLButtonElement, section: document.getElementById('users-section') as HTMLDivElement }
];

tabs.forEach(({ btn, section }) => {
  if(btn.classList.contains('tab-active')) {
    btn.classList.toggle('tab-active', false);
  }
  section.classList.toggle('hidden', true);
})

tabs[tap].btn.classList.toggle('tab-active', true);
tabs[tap].section.classList.toggle('hidden', false);

function activateTab(targetBtn: HTMLButtonElement) {
  tabs.forEach(({ btn, section }, index) => {
    const isActive = btn === targetBtn;

    section.classList.toggle('hidden', !isActive);
    btn.classList.toggle('tab-active', isActive);

    const url = new URL(window.location.href);
    url.searchParams.set('t', index.toString());
    window.history.pushState({}, '', url);
  });
}

tabs.forEach(({ btn }) => {
  btn.addEventListener('click', () => activateTab(btn));
});