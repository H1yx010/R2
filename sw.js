const CACHE_NAME = "R2-STORE-v1";

const FILES_TO_CACHE = [
    "./index.html",
    "./run_lapse.html",
    "./run_poops.html",

    "./chain_lapse.js",
    "./chain_poops.js",
    "./core.js",
    "./mem.js",
    "./int64.js",
    "./ps4_offsets.js",
    "./rpc_worker.js",

    "./logo_raw.png",
    "./payload.bin",

    "./patches/1100.bin",
    "./patches/1150.bin",
    "./patches/1200.bin",
    "./patches/1250.bin",
    "./patches/1300.bin"
];

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME).then(async cache => {

            for (const file of FILES_TO_CACHE) {

                try {

                    const response = await fetch(file, {
                        cache: "no-store"
                    });

                    if (response.ok) {

                        await cache.put(file, response.clone());

                        console.log("CACHED:", file);

                    } else {

                        console.error(
                            "FAILED:",
                            file,
                            "HTTP",
                            response.status
                        );

                    }

                } catch (error) {

                    console.error(
                        "ERROR:",
                        file,
                        error
                    );

                }
            }

        }).then(() => {

            return self.skipWaiting();

        })

    );

});


self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(keys => {

            return Promise.all(

                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))

            );

        }).then(() => {

            return self.clients.claim();

        })

    );

});


self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request).then(cached => {

            if (cached) {

                return cached;

            }

            return fetch(event.request);

        })

    );

});
