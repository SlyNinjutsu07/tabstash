// Pure helpers — no chrome/DOM dependencies, so they can be unit-tested
// in a plain browser tab (see test.html).

function normalizeURL(urlInput){
    try {
        const url = new URL(urlInput);
        let host = url.hostname;
        
        if (host.startsWith('www.')) {
            host = host.substring(4);
        }
        
        url.hash = '';
        
        const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'gclid'];
        trackingParams.forEach(param => url.searchParams.delete(param));
        
        let cleanUrl = `${url.protocol}//${host}${url.pathname}${url.search}`;
        
        if (cleanUrl.endsWith('/')) {
            cleanUrl = cleanUrl.slice(0, -1);
        }
        
        // NO .toLowerCase() here. The URL constructor already lowercases the
        // case-INsensitive parts (protocol + hostname). The path and query are
        // case-SENSITIVE — "/MyPage" != "/mypage" on many servers — so lowercasing
        // them could make a reopened link 404, or merge two different pages.
        return cleanUrl;
    } catch (e) {
        return null;
    }
}
