var http = require('https');

/**
 *  AVL - A VULGAR LANGUAGE
 *  Generative language studies
 */

var base_url = "https://en.wiktionary.org/w/api.php?action=query&format=json&list=categorymembers&cmtitle=Category%3AEnglish_terms_with_IPA_pronunciation&cmlimit=500";

var options = {
  host: 'en.wiktionary.org',
  port: 443,
  path: '/w/api.php?action=query&format=json&list=categorymembers&cmtitle=Category%3AEnglish_terms_with_IPA_pronunciation&cmlimit=500',
  method: 'GET'
};

var req = http.get(options,function(res){
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  // res.setEncoding("utf8");

  var chunks = [];
  res.on('data', function(chunk){
    chunks.push(chunk);
  }).on('end',function(){
    var body = Buffer.concat(chunks).toString();
    console.log(typeof body);
    console.log('BODY: ' + body);
    var json = JSON.parse(body);
    console.log(JSON.stringify(json,null,2));
  })
});

req.on('error',function(e){
  console.log('ERROR: ' + e.message);
});

// getWord();

// public function crawlWords(){
//   $cat_url = "https://en.wiktionary.org/w/api.php?action=query&format=json&list=categorymembers&cmtitle=Category%3AEnglish_terms_with_IPA_pronunciation&cmlimit=500";
//   if(isset($_COOKIE['cmcontinue'])){$cat_url .= "&cmcontinue=".$_COOKIE['cmcontinue'];}
//   $data 	= json_decode(file_get_contents($cat_url),TRUE);
//   $words   = $data['query']['categorymembers'];
//   $cmcontinue = $data['continue']['cmcontinue'];
//     setcookie("cmcontinue",$cmcontinue,time()+86400);
//
//   foreach($words as $row){
//     if(ctype_alpha($row['title'])){
//       //$this->lookup_pro($row['title']);
//     }
//   }
//   return $cmcontinue;
// }
//
// public function lookup_pro($word){
//   $result         = Array();
//   $result['word'] = $word;
//   $lookup_url = "https://en.wiktionary.org/w/api.php?action=parse&page=".$word."&prop=sections&format=json";
//   $data 	   = json_decode(file_get_contents($lookup_url),TRUE);
//
//   $index      = 0;
//   foreach($data['parse']['sections'] as $section){
//     if($section['line'] == 'Pronunciation'){
//       $result[$index]['section'] = $section['index'];
//       $index++;
//     }
//   }
//
//   $index		= 0;
//   foreach($result as $sect){
//     $section    = $sect['section'];
//     $lookup_url = "https://en.wiktionary.org/w/api.php?action=parse&page=".$word."&prop=wikitext&section=".$section."&format=json";
//
//     $t_pro      = json_decode(file_get_contents($lookup_url),TRUE);
//     $t_pro      = $t_pro['parse']['wikitext']['*'];
//     preg_match_all("~\{\{\s*(.*?)\s*\}\}~",$t_pro,$response);
//
//     $j_index = 0;
//     foreach($response[1] as $pronunciation){
//       $p_chunks = explode('|',$pronunciation);
//
//       if(in_array("IPA",$p_chunks)){
//         $c_index = 0;
//         foreach($p_chunks as $chunk){
//           if(preg_match("/lang\=(\w+)/",$chunk,$lang)){
//             $result[$index]['language'] = $lang[1];
//           }else if($chunk !== 'IPA'){
//             $result[$index]['pronunciation'][$c_index] = $chunk;
//             $c_index++;
//           }
//         }
//         $index++;
//         $j_index++;
//       }
//     }
//   }
//   $this->store_word($result);
//   return $result;
// }
