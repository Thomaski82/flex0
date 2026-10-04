/* Prevent overlapping shifts and bookings without enough time to reach the next workplace. */
function shiftInterval(job){
  const start=nextShiftDate(job),end=new Date(start.getTime()+Math.max(0,job.end-job.start)*60*60*1000);
  return{start,end};
}

function travelMinutesBetweenJobs(fromJob,toJob){
  if(!fromJob||!toJob)return 30;
  const km=distanceKm({lat:fromJob.lat,lng:fromJob.lng},{lat:toJob.lat,lng:toJob.lng});
  if(km<.25)return 0;
  const estimate=10+(km*1.25/22*60);
  return Math.max(15,Math.ceil(estimate/5)*5);
}

function scheduleConflictFor(candidateJob,workerEmail=authUser?.email){
  if(!candidateJob||!workerEmail)return null;
  const candidate=shiftInterval(candidateJob);
  const accepted=applications
    .filter(app=>app.workerEmail===workerEmail&&app.jobId!==candidateJob.id&&app.status==='confirmed')
    .map(app=>({app,job:jobs.find(job=>job.id===app.jobId)}))
    .filter(item=>item.job);

  for(const item of accepted){
    const existing=shiftInterval(item.job);
    const sameDate=candidate.start.toDateString()===existing.start.toDateString();
    if(!sameDate)continue;
    if(candidate.start<existing.end&&candidate.end>existing.start){
      return{type:'overlap',job:item.job,requiredMinutes:0,gapMinutes:0,message:`Masz już zarezerwowaną zmianę ${item.job.time} w ${item.job.company}. Godziny obu zmian nakładają się.`};
    }
    const candidateAfter=candidate.start>=existing.end;
    const gapMinutes=Math.max(0,Math.round((candidateAfter?candidate.start-existing.end:existing.start-candidate.end)/60000));
    const fromJob=candidateAfter?item.job:candidateJob,toJob=candidateAfter?candidateJob:item.job;
    const requiredMinutes=travelMinutesBetweenJobs(fromJob,toJob);
    if(gapMinutes<requiredMinutes){
      const direction=candidateAfter?`po zmianie ${item.job.time} w ${item.job.company}`:`przed zmianą ${item.job.time} w ${item.job.company}`;
      return{type:'travel',job:item.job,requiredMinutes,gapMinutes,message:`Nie zdążysz bezpiecznie dotrzeć. Masz tylko ${gapMinutes} min przerwy ${direction}, a orientacyjny dojazd wymaga około ${requiredMinutes} min.`};
    }
  }
  return null;
}

function scheduleConflictNotice(conflict,compact=false){
  const title=conflict.type==='overlap'?'Konflikt godzinowy':'Za mało czasu na dojazd';
  return`<div class="schedule-conflict-notice ${compact?'compact':''}"><span>!</span><div><strong>${title}</strong><p>${conflict.message}</p></div></div>`;
}

const submitApplicationScheduleBase=submitApplication;
submitApplication=function(id){
  if(authUser?.role==='user'){
    const job=jobs.find(item=>item.id===id),conflict=scheduleConflictFor(job);
    if(conflict){
      openJob(id);
      toast(conflict.type==='overlap'?'Nie możesz zarezerwować dwóch zmian w tym samym czasie.':'Między zmianami jest za mało czasu na dojazd.');
      return;
    }
  }
  return submitApplicationScheduleBase(id);
};

const renderJobsScheduleBase=renderJobs;
renderJobs=function(){
  renderJobsScheduleBase();
  if(authUser?.role!=='user')return;
  document.querySelectorAll('#jobsGrid .job-card').forEach(card=>{
    const job=jobs.find(item=>item.id===+card.dataset.id),conflict=scheduleConflictFor(job);
    if(!conflict)return;
    card.classList.add('schedule-conflict-card');
    const cover=card.querySelector('.job-cover');
    if(cover&&!cover.querySelector('.schedule-conflict-badge'))cover.insertAdjacentHTML('beforeend',`<span class="schedule-conflict-badge">${conflict.type==='overlap'?'KOLIZJA GODZIN':'BRAK CZASU NA DOJAZD'}</span>`);
    const footer=card.querySelector('.job-footer button');
    if(footer)footer.textContent='Sprawdź konflikt';
  });
};

const openJobScheduleBase=openJob;
openJob=function(id){
  openJobScheduleBase(id);
  if(authUser?.role!=='user')return;
  const job=jobs.find(item=>item.id===id),conflict=scheduleConflictFor(job),body=jobModal.querySelector('.modal-body');
  if(!conflict||!body||myApplication(id))return;
  const policy=body.querySelector('.cancellation-policy-note');
  if(policy)policy.insertAdjacentHTML('afterend',scheduleConflictNotice(conflict));else body.insertAdjacentHTML('afterbegin',scheduleConflictNotice(conflict));
  const button=body.querySelector('.book-button');
  if(button){button.disabled=true;button.textContent=conflict.type==='overlap'?'Nie możesz wybrać — konflikt godzin':'Nie możesz wybrać — brak czasu na dojazd'}
};

renderJobs();

