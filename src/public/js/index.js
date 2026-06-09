"use strict";
// Elementos
const tabs = [
    { btn: document.getElementById('tab-products'), section: document.getElementById('products-section') },
    { btn: document.getElementById('tab-users'), section: document.getElementById('users-section') }
];
function activateTab(targetBtn) {
    tabs.forEach(({ btn, section }) => {
        const isActive = btn === targetBtn;
        section.classList.toggle('hidden', !isActive);
        btn.classList.toggle('tab-active', isActive);
    });
}
tabs.forEach(({ btn }) => {
    btn.addEventListener('click', () => activateTab(btn));
});
//# sourceMappingURL=index.js.map