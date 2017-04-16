<?php

function print_r2($data){
	echo '<pre>';
	print_r($data);
	echo '</pre>';
}

class AVL {
	public $output,$sourceText,$graphemes,$con;

	public function __construct(){
		$t_text = file_get_contents('avl_assets/formattedText/breton.json',true);
		$t_grph = file_get_contents('avl_assets/graphemeBanks/english_graphemes.json',true);
		
		$this->srcTxt      = json_decode($t_text);
		$this->graphemes   = json_decode($t_grph);

		$this->srcTxtLen   = count((array)$this->srcTxt);
		$this->graphemeLen = count((array)$this->graphemes);

      try{$this->con = new PDO("mysql:host=localhost;dbname=AVL", "wordcrawler", "1t64Ab$");
		}catch(PDOException $e){echo 'Database Error: ' . $e->getMessage();} 
	}

	public function crawlWords(){
		$cat_url = "https://en.wiktionary.org/w/api.php?action=query&format=json&list=categorymembers&cmtitle=Category%3AEnglish_terms_with_IPA_pronunciation&cmlimit=500";
		if(isset($_COOKIE['cmcontinue'])){$cat_url .= "&cmcontinue=".$_COOKIE['cmcontinue'];}
		$data 	= json_decode(file_get_contents($cat_url),TRUE);
		$words   = $data['query']['categorymembers'];
		$cmcontinue = $data['continue']['cmcontinue'];
      setcookie("cmcontinue",$cmcontinue,time()+86400);	

		foreach($words as $row){
			if(ctype_alpha($row['title'])){
				//$this->lookup_pro($row['title']); 
			}
		}
		return $cmcontinue;
	}

	public function lookup_pro($word){
		$result         = Array();
		$result['word'] = $word;
		$lookup_url = "https://en.wiktionary.org/w/api.php?action=parse&page=".$word."&prop=sections&format=json";
		$data 	   = json_decode(file_get_contents($lookup_url),TRUE);
		
		$index      = 0;
		foreach($data['parse']['sections'] as $section){
			if($section['line'] == 'Pronunciation'){
				$result[$index]['section'] = $section['index'];
				$index++;
			}
		}

		$index		= 0;
		foreach($result as $sect){
			$section    = $sect['section'];
			$lookup_url = "https://en.wiktionary.org/w/api.php?action=parse&page=".$word."&prop=wikitext&section=".$section."&format=json";

			$t_pro      = json_decode(file_get_contents($lookup_url),TRUE);
			$t_pro      = $t_pro['parse']['wikitext']['*'];
			preg_match_all("~\{\{\s*(.*?)\s*\}\}~",$t_pro,$response);
			
			$j_index = 0;
			foreach($response[1] as $pronunciation){
				$p_chunks = explode('|',$pronunciation);			
					
				if(in_array("IPA",$p_chunks)){						
					$c_index = 0;
					foreach($p_chunks as $chunk){
						if(preg_match("/lang\=(\w+)/",$chunk,$lang)){
							$result[$index]['language'] = $lang[1];
						}else if($chunk !== 'IPA'){
							$result[$index]['pronunciation'][$c_index] = $chunk;
							$c_index++;
						}
					}
					$index++;
					$j_index++;
				}
			}
		}
		$this->store_word($result);
		return $result;
	}

	private function store_word($word){
		$entry = array();
		$entry['word'] = $word['word'];

		$query = "SELECT * FROM words WHERE word = :word";
		$stmt  = $this->con->prepare($query);
		$stmt->bindParam(':word',$entry['word'],PDO::PARAM_STR);
		$stmt->execute();
		if($stmt->rowCount() == 0){
			$query = "INSERT INTO words (word) VALUES (:word)";
			$stmt  = $this->con->prepare($query);
			$stmt->bindParam(':word',$entry['word'],PDO::PARAM_STR);
			$stmt->execute();		
			$word_id = $this->con->lastInsertId();
				
			foreach($word as $pro){
				if(is_array($pro)){
					$query = "SELECT * FROM language WHERE language = :lang";
					$stmt  = $this->con->prepare($query);
					$stmt->bindParam(':lang',$pro['language'],PDO::PARAM_STR);
					$stmt->execute();

					if($stmt->rowCount() > 0){
						$result = $stmt->fetch(PDO::FETCH_ASSOC);
						$lang_id = $result['id'];
					}else{
						$query = "INSERT INTO language (language) VALUES (:lang)";
						$stmt  = $this->con->prepare($query);
						$stmt->bindParam(':lang',$pro['language'],PDO::PARAM_STR);
						$stmt->execute();
						$lang_id = $this->con->lastInsertId();			
					}
					$query = "INSERT INTO pronunciation (word_id,lang_id,ipa) VALUES (:word_id,:lang_id,:ipa)";
					$stmt  = $this->con->prepare($query);
					$stmt->bindParam(':word_id',$word_id,PDO::PARAM_INT);
					$stmt->bindParam(':lang_id',$lang_id,PDO::PARAM_INT);
					$stmt->bindParam(':ipa',$pro['pronunciation'][0],PDO::PARAM_STR);
					$stmt->execute();
				}
			}
		}
	}

	public function show_tables($table = 'ALL'){
		$query = "SELECT * FROM language";
		$stmt  = $this->con->prepare($query);
		$stmt->execute();
		$lang_dump = $stmt->fetchAll(PDO::FETCH_ASSOC);
		print_r2($lang_dump);

		$query = "SELECT * FROM words";
		$stmt  = $this->con->prepare($query);
		$stmt->execute();
		$word_dump = $stmt->fetchAll(PDO::FETCH_ASSOC);
		print_r2($word_dump);		

		$query = "SELECT * FROM pronunciation";
		$stmt  = $this->con->prepare($query);
		$stmt->execute();
		$pro_dump = $stmt->fetchAll(PDO::FETCH_ASSOC);
		print_r2($pro_dump);	
	
		$query = "SELECT wo.word, pro.ipa, lang.language FROM words as wo LEFT JOIN pronunciation as pro ON words.id = pronunciation.word_id LEFT JOIN language as lang ON pronunciation.lang_id";
		$stmt  = $this->con->prepare($query);
		$stmt->execute();
		$all_dump = $stmt->fetchAll(PDO::FETCH_ASSOC);
		print_r2($all_dump);
   }

	private function search_words(){

	}

	public function get_word(){
		echo $this->srcTxtLen . "<br/>";
		echo $this->graphemeLen . "<br/>";
		return $this->graphemes;	
	}

	public function get_sentence($min,$max){

	}

	public function get_longtext($min,$max){
		
	}
}
?>
