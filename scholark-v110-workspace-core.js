(() => {
  if(window.__SCHOLARK_V110_WORKSPACE_CORE__)return;
  window.__SCHOLARK_V110_WORKSPACE_CORE__=true;

  const KEYS={
    planner:'scholark_v51_planner',
    goals:'scholark_v51_goals',
    mastery:'scholark_v52_mastery',
    assignments:'scholark_v106_assignments',
    focus:'scholark_v106_focus',
    focusHistory:'scholark_v106_focus_history',
    flashcards:'scholark_v106_flashcards',
    language:'scholark_v93_language_progress',
    learningProjects:'scholark_v110_learning_projects',
    activity:'scholark_v110_activity'
  };
  const TRACKED=new Set(Object.values(KEYS));
  const clean=v=>String(v??'').replace(/\s+/g,' ').trim();
  const uid=p=>(p||'id')+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8);
  const read=(key,fallback=null)=>{try{const v=JSON.parse(localStorage.getItem(key)||'null');return v??fallback}catch{return fallback}};
  const array=(key)=>{const x=read(key,[]);return Array.isArray(x)?x:[]};
  const write=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}};
  const now=()=>Date.now();
  const dayKey=(v=Date.now())=>{const d=new Date(v);return Number.isNaN(d.getTime())?'':d.toISOString().slice(0,10)};
  const priorityRank={high:0,medium:1,low:2};
  const safeDate=value=>{if(!value)return Infinity;const t=new Date(String(value).length===10?value+'T23:59:59':value).getTime();return Number.isFinite(t)?t:Infinity};
  const cloudTimers=new Map();
  function cloudRefresh(kind){
    clearTimeout(cloudTimers.get(kind));cloudTimers.set(kind,setTimeout(()=>{cloudTimers.delete(kind);window.dispatchEvent(new CustomEvent('scholark:workspace-cloud-refresh',{detail:{kind,source:'core-r175',preferLocal:true}}))},120));
  }

  if(!window.__SCHOLARK_STORAGE_EVENTS_PATCHED__){
    window.__SCHOLARK_STORAGE_EVENTS_PATCHED__=true;
    const set=Storage.prototype.setItem,remove=Storage.prototype.removeItem;
    Storage.prototype.setItem=function(key,value){
      set.call(this,key,value);
      if(this===localStorage&&TRACKED.has(String(key)))queueMicrotask(()=>window.dispatchEvent(new CustomEvent('scholark-workspace-change',{detail:{key:String(key),kind:'set'}})));
    };
    Storage.prototype.removeItem=function(key){
      remove.call(this,key);
      if(this===localStorage&&TRACKED.has(String(key)))queueMicrotask(()=>window.dispatchEvent(new CustomEvent('scholark-workspace-change',{detail:{key:String(key),kind:'remove'}})));
    };
  }

  addEventListener('storage',e=>{
    if(e.storageArea===localStorage&&TRACKED.has(String(e.key||''))){
      window.dispatchEvent(new CustomEvent('scholark-workspace-change',{detail:{key:String(e.key),kind:'external'}}));
    }
  });

  function planner(){
    return array(KEYS.planner).map(x=>({
      ...x,id:x.id||uid('plan'),text:clean(x.text),type:x.type||'task',subject:clean(x.subject),
      date:clean(x.date),time:clean(x.time),duration:Math.max(0,Number(x.duration)||0),
      priority:['high','medium','low'].includes(x.priority)?x.priority:'medium',
      goalId:clean(x.goalId),sourceKey:clean(x.sourceKey),status:x.status==='done'?'done':'todo'
    }));
  }
  function goals(){
    return array(KEYS.goals).map(x=>({...x,id:x.id||uid('goal'),text:clean(x.text),category:x.category||'learning',date:clean(x.date),sourceKey:clean(x.sourceKey),progress:Math.max(0,Math.min(100,Number(x.progress)||0)),status:x.status==='complete'?'complete':'active'}));
  }
  function mastery(){
    return array(KEYS.mastery).map(x=>({...x,id:x.id||uid('mastery'),subject:clean(x.subject)||'General',topic:clean(x.topic)||'Topic',status:x.status||'Learning',mastery:Math.max(0,Math.min(100,Number(x.mastery)||0)),nextReviewAt:x.nextReviewAt||'',updatedAt:x.updatedAt||''}));
  }
  function assignments(){
    return array(KEYS.assignments).map(x=>({...x,id:x.id||uid('assignment'),title:clean(x.title),subject:clean(x.subject),type:x.type||'assignment',priority:x.priority||'medium',dueDate:clean(x.dueDate),instructions:clean(x.instructions),sourceKey:clean(x.sourceKey),progress:Math.max(0,Math.min(100,Number(x.progress)||0)),status:x.status==='complete'||Number(x.progress)>=100?'complete':'active'}));
  }
  function flashcards(){
    return array(KEYS.flashcards).map(x=>({...x,id:x.id||uid('card'),deck:clean(x.deck)||'General',front:clean(x.front),back:clean(x.back),dueAt:Number(x.dueAt)||0,interval:Number(x.interval)||0,reps:Number(x.reps)||0,lapses:Number(x.lapses)||0,lastReviewedAt:Number(x.lastReviewedAt)||0}));
  }
  function focusHistory(){return array(KEYS.focusHistory)}
  function learningProjects(){return array(KEYS.learningProjects).map(x=>({...x,sourceKey:clean(x.sourceKey)}))}
  function activity(){return array(KEYS.activity)}

  function goalProgress(goal,planRows=planner()){
    if(goal.status==='complete')return 100;
    const linked=planRows.filter(x=>x.goalId===goal.id);
    if(linked.length){const done=linked.filter(x=>x.status==='done').length;return Math.max(goal.progress||0,Math.round(done/linked.length*100))}
    return goal.progress||0;
  }

  function compute(){
    const t=now(),weekAgo=t-7*86400000,today=dayKey(),p=planner(),g=goals(),m=mastery(),a=assignments(),cards=flashcards(),focus=focusHistory(),events=activity();
    const activePlanner=p.filter(x=>x.status!=='done');
    const donePlanner=p.filter(x=>x.status==='done');
    const overduePlanner=activePlanner.filter(x=>x.date&&x.date<today);
    const dueToday=activePlanner.filter(x=>x.date===today);
    const weak=m.filter(x=>x.status!=='Mastered').sort((x,y)=>x.mastery-y.mastery);
    const dueMastery=weak.filter(x=>!x.nextReviewAt||new Date(x.nextReviewAt).getTime()<=t);
    const mastered=m.filter(x=>x.status==='Mastered'||x.mastery>=100);
    const dueCards=cards.filter(x=>!x.dueAt||x.dueAt<=t);
    const reviewedCards7d=cards.filter(x=>x.lastReviewedAt>=weekAgo);
    const activeAssignments=a.filter(x=>x.status!=='complete');
    const overdueAssignments=activeAssignments.filter(x=>x.dueDate&&safeDate(x.dueDate)<t);
    const focusWeek=focus.filter(x=>Number(x.endedAt||x.completedAt||x.startedAt)>=weekAgo);
    const focusMinutes7d=focusWeek.reduce((n,x)=>n+(Number(x.minutes)||Math.round((Number(x.duration)||0)/60)||0),0);
    const goalAvg=g.length?Math.round(g.reduce((n,x)=>n+goalProgress(x,p),0)/g.length):0;
    const completed7d=donePlanner.filter(x=>safeDate(x.completedAt)>=weekAgo).length;
    const daySet=new Set();
    focusWeek.forEach(x=>{const d=dayKey(Number(x.endedAt||x.completedAt||x.startedAt));if(d)daySet.add(d)});
    reviewedCards7d.forEach(x=>{const d=dayKey(x.lastReviewedAt);if(d)daySet.add(d)});
    donePlanner.forEach(x=>{const d=dayKey(x.completedAt);if(d&&safeDate(x.completedAt)>=weekAgo)daySet.add(d)});
    events.filter(x=>Number(x.at)>=weekAgo).forEach(x=>{const d=dayKey(Number(x.at));if(d)daySet.add(d)});
    const consistency=Math.min(100,Math.round(daySet.size/7*100));
    const lang=read(KEYS.language,{})||{};
    const languageLessons=Object.values(lang).reduce((n,x)=>n+(Number(x?.lessons)||0),0);

    let next=null;
    if(overdueAssignments.length){
      const x=[...overdueAssignments].sort((u,v)=>safeDate(u.dueDate)-safeDate(v.dueDate))[0];
      next={tool:'assignments',type:'assignment',title:x.title,reason:'This assignment is overdue.',id:x.id};
    }else if(overduePlanner.length){
      const x=[...overduePlanner].sort((u,v)=>(priorityRank[u.priority]??1)-(priorityRank[v.priority]??1)||safeDate(u.date)-safeDate(v.date))[0];
      next={tool:'planner',type:'planner',title:x.text,reason:'This planner action is overdue.',id:x.id};
    }else if(dueMastery.length){
      const x=dueMastery[0];
      next={tool:'tutor',type:'mastery',title:'Review '+x.topic,reason:'This is one of your weakest due topics.',id:x.id,subject:x.subject};
    }else if(dueCards.length){
      next={tool:'flashcards',type:'flashcards',title:'Review '+dueCards.length+' due flashcard'+(dueCards.length===1?'':'s'),reason:'Spaced repetition is due now.'};
    }else if(dueToday.length){
      const x=[...dueToday].sort((u,v)=>(priorityRank[u.priority]??1)-(priorityRank[v.priority]??1))[0];
      next={tool:'planner',type:'planner',title:x.text,reason:'This is scheduled for today.',id:x.id};
    }else if(activeAssignments.length){
      const x=[...activeAssignments].sort((u,v)=>safeDate(u.dueDate)-safeDate(v.dueDate))[0];
      next={tool:'assignments',type:'assignment',title:x.title,reason:'This is your next active assignment.',id:x.id};
    }else if(g.find(x=>x.status!=='complete')){
      const x=g.find(x=>x.status!=='complete');
      next={tool:'goal',type:'goal',title:x.text,reason:'Take one concrete step toward this active goal.',id:x.id};
    }

    return {
      generatedAt:new Date().toISOString(),
      planner:{all:p,active:activePlanner,done:donePlanner,overdue:overduePlanner,dueToday,completion:p.length?Math.round(donePlanner.length/p.length*100):0,completed7d},
      goals:{all:g,active:g.filter(x=>x.status!=='complete'),average:goalAvg},
      mastery:{all:m,weak,due:dueMastery,mastered},
      assignments:{all:a,active:activeAssignments,overdue:overdueAssignments},
      flashcards:{all:cards,due:dueCards,reviewed7d:reviewedCards7d},
      focus:{history:focus,week:focusWeek,minutes7d:focusMinutes7d},
      activity:{all:events,week:events.filter(x=>Number(x.at)>=weekAgo),consistency},
      language:{raw:lang,lessons:languageLessons},
      projects:learningProjects(),
      next
    };
  }

  function context(){
    const s=compute();
    return {
      country:window.__SCHOLARK_COUNTRY__?.current?.()||localStorage.getItem('scholark_country')||'',
      learningLevel:localStorage.getItem('scholark_learning_level')||'',
      activeGoals:s.goals.active.slice(0,5).map(x=>({id:x.id,goal:x.text,progress:goalProgress(x,s.planner.all),target:x.date||''})),
      nextPlanner:s.planner.active.slice().sort((a,b)=>safeDate(a.date)-safeDate(b.date)).slice(0,8).map(x=>({id:x.id,text:x.text,date:x.date,time:x.time,priority:x.priority,subject:x.subject})),
      weakTopics:s.mastery.weak.slice(0,8).map(x=>({id:x.id,subject:x.subject,topic:x.topic,mastery:x.mastery,nextReviewAt:x.nextReviewAt})),
      dueFlashcards:s.flashcards.due.slice(0,10).map(x=>({deck:x.deck,front:x.front})),
      assignments:s.assignments.active.slice(0,6).map(x=>({id:x.id,title:x.title,subject:x.subject,dueDate:x.dueDate,progress:x.progress,priority:x.priority})),
      focusMinutes7d:s.focus.minutes7d,
      plannerCompletion:s.planner.completion,
      consistency:s.activity.consistency,
      nextBestAction:s.next
    };
  }

  function record(tool,action,meta={}){
    const rows=activity();
    rows.unshift({id:uid('activity'),tool:clean(tool)||'workspace',action:clean(action)||'update',meta:meta&&typeof meta==='object'?meta:{},at:Date.now()});
    write(KEYS.activity,rows.slice(0,500));
  }
  function addPlan(input={}){
    const rows=planner(),sourceKey=clean(input.sourceKey);
    if(sourceKey){const existing=rows.find(x=>x.sourceKey===sourceKey);if(existing)return existing}
    const row={id:input.id||uid('plan'),text:clean(input.text)||'Study action',type:input.type||'task',subject:clean(input.subject),date:clean(input.date),time:clean(input.time),duration:Math.max(0,Number(input.duration)||0),priority:['high','medium','low'].includes(input.priority)?input.priority:'medium',goalId:clean(input.goalId),sourceKey,status:input.status==='done'?'done':'todo',createdAt:new Date().toISOString()};
    rows.push(row);write(KEYS.planner,rows);record('planner','added',{id:row.id,text:row.text,sourceKey});cloudRefresh('planner');return row;
  }
  function updatePlan(id,patch={}){
    const rows=planner(),row=rows.find(x=>x.id===id);if(!row)return null;
    const safe={...patch};delete safe.id;delete safe.createdAt;
    if(safe.text!==undefined)safe.text=clean(safe.text);if(safe.subject!==undefined)safe.subject=clean(safe.subject);if(safe.date!==undefined)safe.date=clean(safe.date);if(safe.time!==undefined)safe.time=clean(safe.time);if(safe.goalId!==undefined)safe.goalId=clean(safe.goalId);
    if(safe.priority!==undefined&&!['high','medium','low'].includes(safe.priority))safe.priority='medium';
    if(safe.duration!==undefined)safe.duration=Math.max(0,Number(safe.duration)||0);
    Object.assign(row,safe,{updatedAt:new Date().toISOString()});write(KEYS.planner,rows);record('planner','updated',{id:row.id,status:row.status||'todo'});cloudRefresh('planner');return row;
  }
  function completePlan(id,done=true){return updatePlan(id,{status:done?'done':'todo',completedAt:done?new Date().toISOString():''})}
  function removePlan(id){const rows=planner(),row=rows.find(x=>x.id===id);if(!row)return false;write(KEYS.planner,rows.filter(x=>x.id!==id));record('planner','deleted',{id});cloudRefresh('planner');return true}
  function addGoal(input={}){
    const rows=goals(),sourceKey=clean(input.sourceKey);if(sourceKey){const existing=rows.find(x=>x.sourceKey===sourceKey);if(existing)return existing}
    const row={id:input.id||uid('goal'),text:clean(input.text)||'Learning goal',category:input.category||'learning',date:clean(input.date),measure:clean(input.measure),sourceKey,progress:Math.max(0,Math.min(100,Number(input.progress)||0)),status:input.status==='complete'?'complete':'active',createdAt:new Date().toISOString()};
    rows.push(row);write(KEYS.goals,rows);record('goal','added',{id:row.id,text:row.text,sourceKey});cloudRefresh('goal');return row;
  }
  function updateGoal(id,patch={}){
    const rows=goals(),row=rows.find(x=>x.id===id);if(!row)return null;const safe={...patch};delete safe.id;delete safe.createdAt;
    if(safe.text!==undefined)safe.text=clean(safe.text);if(safe.date!==undefined)safe.date=clean(safe.date);if(safe.measure!==undefined)safe.measure=clean(safe.measure);if(safe.progress!==undefined)safe.progress=Math.max(0,Math.min(100,Number(safe.progress)||0));
    Object.assign(row,safe,{updatedAt:new Date().toISOString()});write(KEYS.goals,rows);record('goal','updated',{id:row.id,status:row.status||'active'});cloudRefresh('goal');return row;
  }
  function removeGoal(id){const rows=goals(),row=rows.find(x=>x.id===id);if(!row)return false;write(KEYS.goals,rows.filter(x=>x.id!==id));record('goal','deleted',{id});cloudRefresh('goal');return true}
  function addAssignment(input={}){
    const rows=assignments(),sourceKey=clean(input.sourceKey);if(sourceKey){const existing=rows.find(x=>x.sourceKey===sourceKey);if(existing)return existing}
    const row={id:input.id||uid('assignment'),title:clean(input.title)||'Assignment',subject:clean(input.subject),type:input.type||'assignment',priority:['high','medium','low'].includes(input.priority)?input.priority:'medium',dueDate:clean(input.dueDate),instructions:clean(input.instructions),sourceKey,progress:Math.max(0,Math.min(100,Number(input.progress)||0)),status:input.status==='complete'||Number(input.progress)>=100?'complete':'active',createdAt:new Date().toISOString()};
    rows.push(row);write(KEYS.assignments,rows);record('assignments','added',{id:row.id,title:row.title,sourceKey});return row;
  }
  function updateAssignment(id,patch={}){
    const rows=assignments(),row=rows.find(x=>x.id===id);if(!row)return null;const safe={...patch};delete safe.id;delete safe.createdAt;
    if(safe.title!==undefined)safe.title=clean(safe.title);if(safe.subject!==undefined)safe.subject=clean(safe.subject);if(safe.dueDate!==undefined)safe.dueDate=clean(safe.dueDate);if(safe.instructions!==undefined)safe.instructions=clean(safe.instructions);if(safe.progress!==undefined)safe.progress=Math.max(0,Math.min(100,Number(safe.progress)||0));
    if(safe.priority!==undefined&&!['high','medium','low'].includes(safe.priority))safe.priority='medium';
    if(Number(safe.progress)>=100)safe.status='complete';Object.assign(row,safe,{updatedAt:new Date().toISOString()});write(KEYS.assignments,rows);record('assignments','updated',{id:row.id,status:row.status||'active'});return row;
  }
  function removeAssignment(id){const rows=assignments(),row=rows.find(x=>x.id===id);if(!row)return false;write(KEYS.assignments,rows.filter(x=>x.id!==id));record('assignments','deleted',{id});return true}
  function prepareFocus(input={}){
    const state={task:clean(input.task)||'Focus session',duration:Math.max(5,Math.min(240,Number(input.duration)||25)),running:false,endAt:0,remaining:0,linkedPlannerId:clean(input.linkedPlannerId),autoComplete:input.autoComplete!==false,startedAt:0};
    write(KEYS.focus,state);record('focus','prepared',{task:state.task,linkedPlannerId:state.linkedPlannerId,duration:state.duration});return state;
  }
  function upsertMastery(input={}){
    const subject=clean(input.subject)||'General',topic=clean(input.topic);if(!topic)return null;
    const rows=mastery();let row=rows.find(x=>x.subject.toLowerCase()===subject.toLowerCase()&&x.topic.toLowerCase()===topic.toLowerCase());
    if(!row){row={id:uid('mastery'),subject,topic,status:'Learning',mastery:35,nextReviewAt:new Date(Date.now()+2*86400000).toISOString(),updatedAt:new Date().toISOString()};rows.push(row)}
    if(Number.isFinite(Number(input.mastery)))row.mastery=Math.max(0,Math.min(100,Number(input.mastery)));
    if(input.status)row.status=input.status;
    if(input.nextReviewAt!==undefined)row.nextReviewAt=input.nextReviewAt;
    row.updatedAt=new Date().toISOString();write(KEYS.mastery,rows);record('education','mastery_update',{id:row.id,subject,topic,mastery:row.mastery});cloudRefresh('mastery');return row;
  }
  function addFlashcards(deck,items=[]){
    const rows=flashcards();let added=0;
    for(const item of items){
      const front=clean(item?.front||item?.question),back=clean(item?.back||item?.answer);if(!front||!back)continue;
      if(rows.some(x=>x.front.toLowerCase()===front.toLowerCase()&&x.deck.toLowerCase()===clean(deck||'General').toLowerCase()))continue;
      rows.push({id:uid('card'),deck:clean(deck)||'General',front,back,dueAt:0,interval:0,reps:0,ease:2.5,lapses:0,createdAt:new Date().toISOString()});added++;
    }
    if(added){write(KEYS.flashcards,rows);record('flashcards','created',{deck:clean(deck)||'General',count:added})}
    return added;
  }
  function createProject(input={}){
    const rows=learningProjects(),sourceKey=clean(input.sourceKey);if(sourceKey){const existing=rows.find(x=>x.sourceKey===sourceKey);if(existing)return existing}
    const row={id:input.id||uid('project'),title:clean(input.title)||'Learning project',subject:clean(input.subject),type:input.type||'learning',goalId:clean(input.goalId),sourceKey,status:input.status||'active',notes:clean(input.notes),createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
    rows.unshift(row);write(KEYS.learningProjects,rows.slice(0,100));record('project','created',{id:row.id,title:row.title,sourceKey});return row;
  }
  function updateProject(id,patch={}){
    const rows=learningProjects(),row=rows.find(x=>x.id===id);if(!row)return null;
    Object.assign(row,patch,{updatedAt:new Date().toISOString()});write(KEYS.learningProjects,rows);record('project','updated',{id:row.id,status:row.status||''});return row;
  }
  function deleteProject(id){
    const rows=learningProjects(),row=rows.find(x=>x.id===id);if(!row)return false;
    write(KEYS.learningProjects,rows.filter(x=>x.id!==id));record('project','deleted',{id,title:row.title||''});return true;
  }
  function open(tool){
    const t=clean(tool).toLowerCase();if(!t)return;
    if(window.__SCHOLARK_WORKSPACE__?.openTool)window.__SCHOLARK_WORKSPACE__.openTool(t);
    else location.hash=t;
  }

  const api={
    version:'20260920-r175',
    keys:KEYS,
    read,array,write,
    data:{planner,goals,mastery,assignments,flashcards,focusHistory,activity,learningProjects},
    compute,context,record,
    actions:{addPlan,updatePlan,completePlan,removePlan,addGoal,updateGoal,removeGoal,addAssignment,updateAssignment,removeAssignment,prepareFocus,upsertMastery,addFlashcards,createProject,updateProject,deleteProject,open}
  };
  window.__SCHOLARK_WORKSPACE_CORE__=api;
  window.dispatchEvent(new CustomEvent('scholark-workspace-core-ready',{detail:{version:api.version}}));
})();