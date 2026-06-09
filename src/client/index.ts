// Elementos
const tabs = [
  { btn: document.getElementById('tab-products') as HTMLButtonElement, section: document.getElementById('products-section') as HTMLDivElement },
  { btn: document.getElementById('tab-users') as HTMLButtonElement, section: document.getElementById('users-section') as HTMLDivElement }
];

function activateTab(targetBtn: HTMLButtonElement) {
  tabs.forEach(({ btn, section }) => {
    const isActive = btn === targetBtn;
    
    section.classList.toggle('hidden', !isActive);
    btn.classList.toggle('tab-active', isActive);
  });
}


tabs.forEach(({ btn }) => {
  btn.addEventListener('click', () => activateTab(btn));
});