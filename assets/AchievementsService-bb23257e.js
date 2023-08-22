const r={getActiveAchievements(t){return t.filter(e=>e.forever||e.duration&&e.date+e.duration>Date.now())}};export{r as A};
