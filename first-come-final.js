/* Final workflow selector. Loaded after app.js so older optional UI extensions cannot restore candidate selection. */
openCandidates=openCandidatesFirstCome;
candidateStageLabel=candidateStageLabelFirstCome;
employerAttentionItems=employerAttentionItemsFirstCome;
const renderAdminJobsFirstComeBase=renderAdminJobs;
renderAdminJobs=function(){
  renderAdminJobsFirstComeBase();
  document.querySelectorAll('.admin-job-row').forEach(row=>{
    const summary=row.querySelector(':scope>div:nth-child(2)>small');
    if(summary)summary.innerHTML=summary.innerHTML.replace(/ zgłoszeń/g,' rezerwacji');
    const action=row.querySelector('.candidates-action');
    if(action){action.title='Zapisani pracownicy';action.setAttribute('aria-label','Zapisani pracownicy')}
  });
  const testButton=document.querySelector('#employerTestFlowBtn');
  if(testButton)testButton.textContent='↻ Uruchom test rezerwacji';
  const employerLead=document.querySelector('#employer .admin-heading>div>span');
  if(employerLead)employerLead.textContent='Dodawaj oferty, sprawdzaj automatyczne rezerwacje i kontroluj status zmian.';
};
renderJobs();
renderBooked();
renderDashboardSummary();
renderWorkerNotifications();
renderAdminJobs();
