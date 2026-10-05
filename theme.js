/* Persistent light / system / dark appearance selector. */
const THEME_STORAGE_KEY='temporeo-theme';
const themeMedia=window.matchMedia('(prefers-color-scheme: dark)');
let themeMode=localStorage.getItem(THEME_STORAGE_KEY)||'auto';
function resolvedTheme(mode=themeMode){return mode==='auto'?(themeMedia.matches?'dark':'light'):mode}
function applyTheme(mode=themeMode){
  themeMode=['light','auto','dark'].includes(mode)?mode:'auto';
  const resolved=resolvedTheme(themeMode),root=document.documentElement;
  root.dataset.theme=resolved;root.dataset.themeMode=themeMode;root.style.colorScheme=resolved;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',resolved==='dark'?'#0e1418':'#f3f5f7');
  document.querySelectorAll('.theme-switch button').forEach(button=>button.classList.toggle('active',button.dataset.themeMode===themeMode));
}
function setTheme(mode){localStorage.setItem(THEME_STORAGE_KEY,mode);applyTheme(mode)}
function setupThemeSelector(){
  if(document.querySelector('.theme-switch'))return;
  const switcher=document.createElement('div');switcher.className='theme-switch';switcher.setAttribute('aria-label','Motyw kolorystyczny');switcher.innerHTML='<span>MOTYW</span><button data-theme-mode="light" title="Zawsze jasny">JASNY</button><button data-theme-mode="auto" title="Zgodnie z urządzeniem">AUTO</button><button data-theme-mode="dark" title="Zawsze ciemny">CIEMNY</button>';
  document.body.appendChild(switcher);applyTheme();
}
themeMedia.addEventListener?.('change',()=>{if(themeMode==='auto')applyTheme('auto')});
document.addEventListener('click',event=>{const button=event.target.closest?.('.theme-switch [data-theme-mode]');if(button)setTheme(button.dataset.themeMode)});
setupThemeSelector();

