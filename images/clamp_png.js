/* eslint-disable */
var img = new Image();
window.phetImages.push( img );
img.src = 'data:image/png;base64,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';
export default img;
