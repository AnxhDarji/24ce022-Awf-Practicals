const taskEvents = require('./taskEvents');

taskEvents.on('task-created', (taskInfo) => {
  setTimeout(async () => {
    const title = taskInfo?.title || 'unknown task';
    try {
      console.log(`[${new Date().toISOString()}] Notification started: task "${title}" created by user ${taskInfo?.userId}.`);
      await Promise.resolve();
      console.log(`[${new Date().toISOString()}] Notification: task "${title}" was created at ${taskInfo?.timestamp} by user ${taskInfo?.userId}.`);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Task-created notification failed:`, error);
    } finally {
      console.log(`[${new Date().toISOString()}] Notification finished for task "${title}".`);
    }
  }, 2000);
});

taskEvents.on('task-edeleted', (taskInfo) => {
  setTimeout(() => {
    try {
      console.log(`[${new Date().toISOString()}] Task ${taskInfo.taskId} was deleted by user ${taskInfo.userId} at ${taskInfo.timestamp}.`);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Task-deleted notification failed:`, error);
    }
  }, 2000);
});

module.exports = taskEvents;
