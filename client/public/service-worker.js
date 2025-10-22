console.log("Service Worker is Loading...");
self.addEventListener('push',e => {
    const data = e.data.json();
    console.log("Push notification received : ",data);
    self.registration.showNotification(data.title,{
        body : data.body,
        icon : '.favicon.ico'
    });
});
console.log("Service Worker is Loaded...");