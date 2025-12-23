let nextId = 1;
const activeJobs = [];

export function startJob(type) {
  const id = nextId++;
  activeJobs.push({ id, type, startedAt: new Date().toISOString() });
  return id;
}

export function endJob(id) {
  const idx = activeJobs.findIndex(j => j.id === id);
  if (idx !== -1) activeJobs.splice(idx, 1);
}

export function getStats() {
  const activeCount = activeJobs.length;
  const activeByType = activeJobs.reduce((acc, j) => {
    acc[j.type] = (acc[j.type] || 0) + 1;
    return acc;
  }, {});
  return {
    activeCount,
    activeByType,
    queueLength: 0,
    activeJobs
  };
}
