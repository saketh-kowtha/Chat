var ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
 
var toneAnalyzer = new ToneAnalyzerV3({
  iam_apikey: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXX', //Your IBM API KEY
  version: '2017-09-21', 
  url: 'https://gateway-lon.watsonplatform.net/tone-analyzer/api'
});
 


  const tone = (msg, cb) => {
    let _default = {
      "document_tone": {
        "tones": []
      }
    }
    toneAnalyzer.tone(
      {
        tone_input: msg,
        content_type: 'text/plain'
      })
      .then(result => {
        cb(JSON.stringify(result, null, 2));
      })
      .catch(err => {
        console.log(err)
        cb(JSON.stringify(_default))
      });
  }

  module.exports ={
    tone
  }
