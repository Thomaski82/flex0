/* Guided job creation: pick a role and start from editable operational defaults. */
const JOB_PRESETS=[
  {id:'warehouse-picker',icon:'▦',role:'Kompletowanie zamówień',category:'MAGAZYN',industry:'logistics',customerFacing:false,tasks:'Kompletowanie produktów według listy, Pakowanie przesyłek, Kontrola zgodności produktów i etykiet',arrival:'Przyjdź 10 minut wcześniej i zgłoś się do koordynatora zmiany przy wejściu pracowniczym.',dressCode:'Wygodny strój roboczy i pełne, stabilne obuwie. Kamizelkę ochronną zapewnia firma.',documents:'Dokument tożsamości',instructions:'Na początku zmiany odbędziesz krótkie wdrożenie stanowiskowe. Telefon pozostaw w szafce podczas pracy.'},
  {id:'warehouse-sorter',icon:'⌂',role:'Sortowanie przesyłek',category:'MAGAZYN',industry:'logistics',customerFacing:false,tasks:'Sortowanie przesyłek według kierunków, Skanowanie kodów, Przygotowanie paczek do wysyłki',arrival:'Przyjdź 15 minut wcześniej do wejścia pracowniczego i odbierz identyfikator.',dressCode:'Wygodny strój, długie spodnie i zakryte obuwie z antypoślizgową podeszwą.',documents:'Dokument tożsamości',instructions:'Skaner i pozostały sprzęt otrzymasz na miejscu. Przestrzegaj oznaczonych ciągów komunikacyjnych.'},
  {id:'inventory',icon:'◼',role:'Inwentaryzacja',category:'HANDEL',industry:'retail',customerFacing:false,tasks:'Liczenie towaru, Skanowanie kodów produktów, Porządkowanie i oznaczanie policzonych sekcji',arrival:'Przyjdź 10 minut wcześniej do wejścia dla personelu. Koordynator przydzieli Ci sekcję.',dressCode:'Ciemny, wygodny strój bez dużych logotypów i pełne obuwie.',documents:'Dokument tożsamości',instructions:'Naładuj telefon przed zmianą. Skaner lub dostęp do aplikacji otrzymasz podczas odprawy.'},
  {id:'shelf-stacker',icon:'▤',role:'Wykładanie towaru',category:'HANDEL',industry:'retail',customerFacing:false,tasks:'Uzupełnianie towaru na półkach, Kontrola zgodności cen i etykiet, Utrzymanie porządku w przydzielonej alejce',arrival:'Przyjdź 10 minut wcześniej i zgłoś się w punkcie obsługi lub u kierownika zmiany.',dressCode:'Ciemne spodnie, jednolita koszulka i pełne wygodne obuwie. Element firmowy zapewnia zleceniodawca.',documents:'Dokument tożsamości',instructions:'Przed rozpoczęciem otrzymasz instrukcję rozmieszczenia produktów oraz zasady bezpieczeństwa sklepu.'},
  {id:'retail-support',icon:'◇',role:'Wsparcie sprzedaży',category:'OBSŁUGA KLIENTA',industry:'retail',customerFacing:true,tasks:'Pomoc klientom w odnalezieniu produktów, Porządkowanie ekspozycji, Uzupełnianie materiałów sprzedażowych',arrival:'Przyjdź 15 minut wcześniej i zgłoś się do kierownika sklepu.',dressCode:'Schludny, jednolity strój w neutralnych kolorach oraz czyste, pełne obuwie.',documents:'Dokument tożsamości',instructions:'Przed zmianą zapoznasz się z podstawową ofertą sklepu i standardem obsługi klienta.'},
  {id:'reception',icon:'▤',role:'Wsparcie recepcji',category:'BIURO',industry:'office',customerFacing:true,tasks:'Witanie gości i kierowanie ich do odpowiednich osób, Obsługa korespondencji, Bieżące wsparcie recepcji',arrival:'Przyjdź 15 minut wcześniej. Zgłoś się w recepcji głównej i poproś o koordynatora zmiany.',dressCode:'Strój business casual: schludna koszula lub bluzka, ciemne spodnie i zakryte obuwie.',documents:'Dokument tożsamości',instructions:'Na miejscu otrzymasz krótką listę kontaktów, instrukcję obsługi wejścia i zasady przyjmowania gości.'},
  {id:'office-help',icon:'▧',role:'Pomoc administracyjna',category:'BIURO',industry:'office',customerFacing:false,tasks:'Porządkowanie dokumentów, Wprowadzanie podstawowych danych, Przygotowanie materiałów dla zespołu',arrival:'Przyjdź 10 minut wcześniej i zgłoś się w recepcji budynku.',dressCode:'Schludny strój codzienny odpowiedni do pracy biurowej.',documents:'Dokument tożsamości',instructions:'Zakres dostępu do dokumentów i systemów wyjaśni opiekun na początku zmiany.'},
  {id:'event-service',icon:'✦',role:'Obsługa wydarzenia',category:'EVENTY',industry:'events',customerFacing:true,tasks:'Rejestracja uczestników, Kierowanie gości do właściwych stref, Wsparcie organizatora podczas wydarzenia',arrival:'Przyjdź 20 minut wcześniej na odprawę zespołu w wyznaczonym punkcie zbiórki.',dressCode:'Cały czarny, schludny strój bez widocznych logotypów oraz wygodne pełne obuwie.',documents:'Dokument tożsamości',instructions:'Identyfikator i potrzebny sprzęt otrzymasz na miejscu. Nie opuszczaj stanowiska bez poinformowania koordynatora.'},
  {id:'event-setup',icon:'⌁',role:'Montaż i demontaż eventu',category:'EVENTY',industry:'events',customerFacing:false,tasks:'Rozstawianie lekkiego wyposażenia i oznaczeń, Przygotowanie stanowisk, Porządkowanie przestrzeni po wydarzeniu',arrival:'Przyjdź 15 minut wcześniej pod wskazane wejście techniczne.',dressCode:'Wygodny strój roboczy, długie spodnie i pełne obuwie. Rękawice zapewnia firma.',documents:'Dokument tożsamości',instructions:'Wykonuj polecenia koordynatora technicznego i nie obsługuj sprzętu bez wcześniejszego instruktażu.'},
  {id:'promoter',icon:'◎',role:'Promotor / hostessa / host',category:'TEREN',industry:'field',customerFacing:true,tasks:'Aktywne zapraszanie zainteresowanych osób, Przekazywanie materiałów promocyjnych, Raportowanie liczby kontaktów',arrival:'Przyjdź 15 minut wcześniej do punktu zbiórki i odbierz materiały.',dressCode:'Schludny strój w neutralnych kolorach. Elementy brandingu zapewnia firma.',documents:'Dokument tożsamości',instructions:'Przed startem otrzymasz krótkie szkolenie z komunikatu marki, lokalizacji i zasad raportowania.'},
  {id:'survey',icon:'◎',role:'Ankieter terenowy',category:'TEREN',industry:'field',customerFacing:true,tasks:'Zapraszanie osób do udziału w krótkiej ankiecie, Rejestrowanie odpowiedzi, Raportowanie postępu',arrival:'Przyjdź 15 minut wcześniej do punktu startowego i zgłoś się do koordynatora.',dressCode:'Swobodny, schludny strój odpowiedni do pogody i wygodne obuwie.',documents:'Dokument tożsamości',instructions:'Telefon lub tablet służbowy otrzymasz na miejscu. Ankiety prowadź wyłącznie w wyznaczonym obszarze.'},
  {id:'cleaning',icon:'✣',role:'Wsparcie porządkowe',category:'SERWIS',industry:'office',customerFacing:false,tasks:'Porządkowanie wskazanych przestrzeni, Uzupełnianie środków higienicznych, Segregowanie i wynoszenie odpadów',arrival:'Przyjdź 10 minut wcześniej do wejścia pracowniczego i zgłoś się do koordynatora.',dressCode:'Wygodny strój roboczy i pełne antypoślizgowe obuwie. Środki ochronne zapewnia firma.',documents:'Dokument tożsamości',instructions:'Środki i sprzęt otrzymasz na miejscu. Stosuj je wyłącznie zgodnie z instrukcją koordynatora.'}
];

const jobPresetForm=document.querySelector('#adminJobForm');
const roleField=jobPresetForm?.elements.role;

function jobPresetByRole(role){return JOB_PRESETS.find(item=>item.role===role)}
function renderJobPresetPicker(selected=''){
  const picker=jobPresetForm?.querySelector('.job-preset-picker');if(!picker)return;
  picker.querySelectorAll('[data-job-preset]').forEach(button=>button.classList.toggle('active',button.dataset.jobPreset===selected));
  const current=JOB_PRESETS.find(item=>item.id===selected);
  picker.querySelector('[data-selected-role]').textContent=current?current.role:'Wybierz stanowisko z katalogu';
}
function applyJobPreset(id,{fill=true}={}){
  const preset=JOB_PRESETS.find(item=>item.id===id);if(!preset||!jobPresetForm)return;
  roleField.value=preset.role;renderJobPresetPicker(id);
  if(!fill)return;
  jobPresetForm.elements.industry.value=preset.industry;
  jobPresetForm.elements.customerFacing.checked=preset.customerFacing;
  ['tasks','arrival','dressCode','documents','instructions'].forEach(key=>{jobPresetForm.elements[key].value=preset[key]});
  jobPresetForm.elements.industry.dispatchEvent(new Event('input',{bubbles:true}));
  jobPresetForm.elements.tasks.focus();
  toast(`Uzupełniliśmy domyślne informacje dla stanowiska: ${preset.role}. Możesz je teraz edytować.`);
}
function setupJobPresetPicker(){
  if(!jobPresetForm||!roleField||jobPresetForm.querySelector('.job-preset-picker'))return;
  const originalLabel=roleField.closest('label');originalLabel.classList.add('job-role-storage');roleField.type='hidden';roleField.placeholder='';
  const picker=document.createElement('section');picker.className='job-preset-picker';
  picker.innerHTML=`<div class="job-preset-heading"><div><small>1 · WYBIERZ STANOWISKO</small><strong data-selected-role>Wybierz stanowisko z katalogu</strong></div><select aria-label="Filtr kategorii stanowisk"><option value="all">Wszystkie kategorie</option>${[...new Set(JOB_PRESETS.map(item=>item.category))].map(category=>`<option value="${category}">${category}</option>`).join('')}</select></div><div class="job-preset-grid">${JOB_PRESETS.map(item=>`<button type="button" data-job-preset="${item.id}" data-category="${item.category}"><span>${item.icon}</span><div><strong>${item.role}</strong><small>${item.category}</small></div><b>+</b></button>`).join('')}</div><p>Po wyborze automatycznie uzupełnimy opis, strój i instrukcje. Wszystkie podpowiedzi możesz zmienić.</p>`;
  originalLabel.before(picker);
  picker.querySelectorAll('[data-job-preset]').forEach(button=>button.onclick=()=>applyJobPreset(button.dataset.jobPreset));
  picker.querySelector('select').onchange=event=>picker.querySelectorAll('[data-job-preset]').forEach(button=>button.hidden=event.target.value!=='all'&&button.dataset.category!==event.target.value);
  originalLabel.hidden=true;
  const tasksLabel=jobPresetForm.elements.tasks.closest('label');tasksLabel.childNodes[0].textContent='Opis stanowiska i obowiązki';
  tasksLabel.insertAdjacentHTML('beforeend','<small class="preset-edit-note">To jest edytowalna podpowiedź — dopasuj ją do konkretnego zlecenia.</small>');
}

setupJobPresetPicker();
const openNewJobPresetBase=openNewJob;
openNewJob=function(){openNewJobPresetBase();if(!jobPresetForm)return;roleField.value='';jobPresetForm.querySelector('.job-preset-picker select').value='all';jobPresetForm.querySelectorAll('[data-job-preset]').forEach(button=>button.hidden=false);renderJobPresetPicker('')};
const editAdminJobPresetBase=editAdminJob;
editAdminJob=function(id){editAdminJobPresetBase(id);const preset=jobPresetByRole(roleField.value);renderJobPresetPicker(preset?.id||'')};
document.querySelector('#addJobBtn').onclick=openNewJob;
document.querySelector('#employerAddJobBtn').onclick=openNewJob;
jobPresetForm.addEventListener('submit',event=>{if(roleField.value.trim())return;event.preventDefault();event.stopImmediatePropagation();jobPresetForm.querySelector('.job-preset-picker').scrollIntoView({behavior:'smooth',block:'start'});toast('Najpierw wybierz stanowisko z katalogu.')},true);

