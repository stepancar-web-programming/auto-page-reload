console.log('index.js loaded!');

function subscribe() {
    fetch('/subscribe').then(() => {
        console.log('file was changed, reload');
        window.location.reload();
    }).catch(() => {
        subscribe();
    });
    console.log('subscribe!');
};

subscribe();
