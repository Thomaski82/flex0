/* Use the company profile address by default; reveal location fields only for another workplace. */
const companyAddressUser=()=>registeredUsers.find(user=>user.email===authUser?.email&&user.role==='employer');
function companyAddressData(){
  const user=companyAddressUser();if(!user)return null;
  const city=user.companyCity||'',area=user.companyArea||'',street=user.companyStreet||'',buildingNumber=user.companyBuildingNumber||'';
  if(!JOB_LOCATION_DIRECTORY[city]?.[area]?.includes(street)||!/^[0-9]{1,4}[A-Za-z]?(?:\/[0-9]{1,4})?$/.test(buildingNumber))return null;
  return{city,area,street,buildingNumber,address:`${/^(Plac|Rondo|Aleja)/.test(street)?street:`ul. ${street}`} ${buildingNumber}, ${city}`};
}
function saveCompanyAddress(user,data){Object.assign(user,{companyCity:data.city,companyArea:data.area,companyStreet:data.street,companyBuildingNumber:data.buildingNumber});localStorage.setItem('flexo-users',JSON.stringify(registeredUsers))}
const demoEmployer=registeredUsers.find(user=>user.email==='firma@flexo.pl');
if(demoEmployer&&!demoEmployer.companyCity)saveCompanyAddress(demoEmployer,{city:'Warszawa',area:'Śródmieście',street:'Marszałkowska',buildingNumber:'1'});

function setupEmployerAddressRegistration(){
  const box=document.querySelector('#registerForm .employer-registration');if(!box||box.querySelector('.company-address-registration'))return;
  box.insertAdjacentHTML('beforeend',`<section class="company-address-registration"><small>ADRES FIRMY</small><div class="field-row"><label>Miasto<select name="companyCity"></select></label><label>Dzielnica<select name="companyArea"></select></label></div><div class="field-row"><label>Ulica<select name="companyStreet"></select></label><label>Numer budynku<input name="companyBuildingNumber" maxlength="12" placeholder="np. 10A"></label></div><p>Ten adres będzie automatycznie używany przy nowych zleceniach. Zawsze możesz wskazać inne miejsce pracy.</p></section>`);
  const form=document.querySelector('#registerForm'),city=form.elements.companyCity,area=form.elements.companyArea,street=form.elements.companyStreet;
  const fill=(cityValue='Warszawa',areaValue='Śródmieście',streetValue='Marszałkowska')=>{city.innerHTML=optionMarkup(Object.keys(JOB_LOCATION_DIRECTORY),'Wybierz miasto',cityValue);area.innerHTML=optionMarkup(Object.keys(JOB_LOCATION_DIRECTORY[cityValue]||{}),'Wybierz dzielnicę',areaValue);street.innerHTML=optionMarkup(JOB_LOCATION_DIRECTORY[cityValue]?.[areaValue]||[],'Wybierz ulicę',streetValue)};
  fill();city.onchange=()=>fill(city.value,Object.keys(JOB_LOCATION_DIRECTORY[city.value]||{})[0],'');area.onchange=()=>fill(city.value,area.value,'');
}
setupEmployerAddressRegistration();
const registerCompanyAddressBase=register;
register=function(form){
  const data=new FormData(form),isEmployer=selectedRegisterRole==='employer';
  if(isEmployer){const address={city:data.get('companyCity'),area:data.get('companyArea'),street:data.get('companyStreet'),buildingNumber:(data.get('companyBuildingNumber')||'').trim()};if(!JOB_LOCATION_DIRECTORY[address.city]?.[address.area]?.includes(address.street)||!/^[0-9]{1,4}[A-Za-z]?(?:\/[0-9]{1,4})?$/.test(address.buildingNumber)){document.querySelector('#registerError').textContent='Uzupełnij prawidłowy adres firmy.';return}const email=data.get('email').trim().toLowerCase();registerCompanyAddressBase(form);const user=registeredUsers.find(item=>item.email===email);if(user)saveCompanyAddress(user,address);return}
  registerCompanyAddressBase(form);
};

function setupCompanyAddressJobForm(){
  const section=document.querySelector('#adminJobForm .location-form-section');if(!section||section.querySelector('.company-address-choice'))return;
  const rows=[...section.querySelectorAll(':scope > .field-row')],note=section.querySelector('.location-validation-note'),alternate=document.createElement('div');alternate.className='alternate-job-address';rows.forEach(row=>alternate.appendChild(row));if(note)alternate.appendChild(note);section.appendChild(alternate);
  section.querySelector(':scope > small').insertAdjacentHTML('afterend',`<div class="company-address-choice"><div><span>ADRES FIRMY Z PROFILU</span><strong data-company-address>Uzupełnij adres w profilu firmy</strong></div><label><input type="checkbox" name="differentJobAddress"><span>Zlecenie pod innym adresem</span></label></div>`);
  section.updateCompanyAddress=()=>{const address=companyAddressData(),different=section.querySelector('[name="differentJobAddress"]').checked||!address;section.querySelector('[data-company-address]').textContent=address?.address||'Brak kompletnego adresu firmy';alternate.hidden=!different;rows.flatMap(row=>[...row.querySelectorAll('select,input')]).forEach(input=>input.required=different);section.classList.toggle('using-company-address',!different)};
  section.querySelector('[name="differentJobAddress"]').onchange=section.updateCompanyAddress;section.updateCompanyAddress();
}
setupCompanyAddressJobForm();
const validateJobLocationCompanyBase=validateJobLocationForm;
validateJobLocationForm=function(form){const useCompany=!form.elements.differentJobAddress?.checked,profileAddress=companyAddressData(),phone=formatPolishPhone(form.elements.contactPhone.value);if(useCompany&&profileAddress){if(!phone)return toast('Podaj prawidłowy polski numer telefonu: 9 cyfr, opcjonalnie z prefiksem +48.'),null;return{...profileAddress,contactPhone:phone}}return validateJobLocationCompanyBase(form)};
const openNewJobCompanyBase=openNewJob;
openNewJob=function(){openNewJobCompanyBase();const form=document.querySelector('#adminJobForm'),address=companyAddressData(),section=form.querySelector('.location-form-section');if(authUser?.role==='employer'&&address){setJobCity(address.city,address.area,address.street);form.elements.buildingNumber.value=address.buildingNumber;form.elements.differentJobAddress.checked=false;if(authUser.companyName)form.elements.company.value=authUser.companyName}else form.elements.differentJobAddress.checked=true;section.updateCompanyAddress?.()};
const editAdminJobCompanyBase=editAdminJob;
editAdminJob=function(id){editAdminJobCompanyBase(id);const form=document.querySelector('#adminJobForm'),job=jobs.find(item=>item.id===id),address=companyAddressData(),same=address&&job&&job.city===address.city&&job.area===address.area&&job.street===address.street&&job.buildingNumber===address.buildingNumber;form.elements.differentJobAddress.checked=!same;form.querySelector('.location-form-section').updateCompanyAddress?.()};

