import React from 'react';

export default function PlaybackIcon({playing}){
 return <svg viewBox="0 0 20 20" width="15" height="15" fill="currentColor" aria-hidden="true" focusable="false">{playing?<><rect x="5" y="4" width="3" height="12" rx="1"/><rect x="12" y="4" width="3" height="12" rx="1"/></>:<path d="M6 3.9a1 1 0 0 1 1.5-.86l9 6.1a1 1 0 0 1 0 1.72l-9 6.1a1 1 0 0 1-1.5-.86Z"/>}</svg>;
}
