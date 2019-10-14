const MobilinkVariablesConstants = {
  data () {
    return {
      get end_point () {
        return window.themeDisplay ? window.themeDisplay.getCDNBaseURL() + '/o/v2/mobilink/' : 'http://localhost:8081/api/'
      },
      get end_point_new () {
        return window.themeDisplay ? window.themeDisplay.getCDNBaseURL() + '/o/v2.1/mbl/' : 'http://192.168.10.36:8081/api/'
      },
      get group_id () {
        return window.themeDisplay ? window.themeDisplay.getScopeGroupId() : 42942
      },
      get user_id () {
        return window.themeDisplay ? window.themeDisplay.getUserId() : 32970
      },
      get user_name () {
        return window.themeDisplay ? window.themeDisplay.getUserName() : 'Mobilink'
      },
      get language () {
        return window.themeDisplay ? window.themeDisplay.getLanguageId().substring(0, 2) : 'vi'
      },
      get languageLong () {
        return window.themeDisplay ? window.themeDisplay.getLanguageId().split('_').join('-') : 'vi-VN'
      },
      get localeDateProperties () {
        let data = {
          'ca-es': { 'dayNames': ['diumenge', 'dilluns', 'dimarts', 'dimecres', 'dijous', 'divendres', 'dissabte'], 'dayNamesShort': ['dg', 'dl', 'dt', 'dc', 'dj', 'dv', 'ds'], 'monthNames': ['gener', 'febrer', 'març', 'abril', 'maig', 'juny', 'juliol', 'agost', 'setembre', 'octubre', 'novembre', 'desembre', ''], 'monthNamesShort': ['gen.', 'febr.', 'març', 'abr.', 'maig', 'juny', 'jul.', 'ag.', 'set.', 'oct.', 'nov.', 'des.', ''], 'timePattern': 'H:mm', 'dateTimeMomentPattern': 'DD/MM/YYYY HH:mm', 'dateMomentPattern': 'DD/MM/YYYY', 'datePattern': 'dd/MM/yyyy', 'dateTimePattern': 'dd/MM/yyyy H:mm', 'timeFormat': 'Clock24Hours', 'weekStarts': 1 },
          'cs-cz': { 'dayNames': ['neděle', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota'], 'dayNamesShort': ['ne', 'po', 'út', 'st', 'čt', 'pá', 'so'], 'monthNames': ['leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec', ''], 'monthNamesShort': ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', ''], 'timePattern': 'H:mm', 'dateTimeMomentPattern': 'DD/MM/YYYY HH:mm', 'dateMomentPattern': 'DD/MM/YYYY', 'datePattern': 'd. M. yyyy', 'dateTimePattern': 'd. M. yyyy H:mm', 'timeFormat': 'Clock24Hours', 'weekStarts': 1 },
          'da-dk': { 'dayNames': ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'], 'dayNamesShort': ['sø', 'ma', 'ti', 'on', 'to', 'fr', 'lø'], 'monthNames': ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december', ''], 'monthNamesShort': ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec', ''], 'timePattern': 'HH:mm', 'dateTimeMomentPattern': 'DD/MM/YYYY HH:mm', 'dateMomentPattern': 'DD/MM/YYYY', 'datePattern': 'dd-MM-yyyy', 'dateTimePattern': 'dd-MM-yyyy HH:mm', 'timeFormat': 'Clock24Hours', 'weekStarts': 1 },
          'de-at': { 'dayNames': ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'], 'dayNamesShort': ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'], 'monthNames': ['Jänner', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember', ''], 'monthNamesShort': ['Jän', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez', ''], 'timePattern': 'HH:mm', 'dateTimeMomentPattern': 'DD/MM/YYYY HH:mm', 'dateMomentPattern': 'DD/MM/YYYY', 'datePattern': 'dd.MM.yyyy', 'dateTimePattern': 'dd.MM.yyyy HH:mm', 'timeFormat': 'Clock24Hours', 'weekStarts': 1 },
          'de-ch': { 'dayNames': ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'], 'dayNamesShort': ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'], 'monthNames': ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember', ''], 'monthNamesShort': ['Jan', 'Feb', 'Mrz', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez', ''], 'timePattern': 'HH:mm', 'dateTimeMomentPattern': 'DD/MM/YYYY HH:mm', 'dateMomentPattern': 'DD/MM/YYYY', 'datePattern': 'dd.MM.yyyy', 'dateTimePattern': 'dd.MM.yyyy HH:mm', 'timeFormat': 'Clock24Hours', 'weekStarts': 1 },
          'de-de': { 'dayNames': ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'], 'dayNamesShort': ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'], 'monthNames': ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember', ''], 'monthNamesShort': ['Jan', 'Feb', 'Mrz', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez', ''], 'timePattern': 'HH:mm', 'dateTimeMomentPattern': 'DD/MM/YYYY HH:mm', 'dateMomentPattern': 'DD/MM/YYYY', 'datePattern': 'dd.MM.yyyy', 'dateTimePattern': 'dd.MM.yyyy HH:mm', 'timeFormat': 'Clock24Hours', 'weekStarts': 1 },
          'de-lu': { 'dayNames': ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'], 'dayNamesShort': ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'], 'monthNames': ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember', ''], 'monthNamesShort': ['Jan', 'Feb', 'Mrz', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez', ''], 'timePattern': 'HH:mm', 'dateTimeMomentPattern': 'DD/MM/YYYY HH:mm', 'dateMomentPattern': 'DD/MM/YYYY', 'datePattern': 'dd.MM.yyyy', 'dateTimePattern': 'dd.MM.yyyy HH:mm', 'timeFormat': 'Clock24Hours', 'weekStarts': 1 },
          'en-au': { 'dayNames': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], 'dayNamesShort': ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'], 'monthNames': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', ''], 'monthNamesShort': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', ''], 'timePattern': 'h:mm tt', 'dateTimeMomentPattern': 'DD/MM/YYYY HH:mm', 'dateMomentPattern': 'DD/MM/YYYY', 'datePattern': 'd/MM/yyyy', 'dateTimePattern': 'd/MM/yyyy h:mm tt', 'timeFormat': 'Clock12Hours', 'weekStarts': 1 },
          'en-ca': { 'dayNames': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], 'dayNamesShort': ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'], 'monthNames': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', ''], 'monthNamesShort': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', ''], 'timePattern': 'h:mm tt', 'dateTimeMomentPattern': 'DD/MM/YYYY HH:mm', 'dateMomentPattern': 'DD/MM/YYYY', 'datePattern': 'yyyy-MM-dd', 'dateTimePattern': 'yyyy-MM-dd h:mm tt', 'timeFormat': 'Clock12Hours', 'weekStarts': 0 },
          'en-gb': { 'dayNames': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], 'dayNamesShort': ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'], 'monthNames': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', ''], 'monthNamesShort': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', ''], 'timePattern': 'HH:mm', 'dateTimeMomentPattern': 'DD/MM/YYYY HH:mm', 'dateMomentPattern': 'DD/MM/YYYY', 'datePattern': 'dd/MM/yyyy', 'dateTimePattern': 'dd/MM/yyyy HH:mm', 'timeFormat': 'Clock24Hours', 'weekStarts': 1 },
          'en-us': { 'dayNames': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], 'dayNamesShort': ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'], 'monthNames': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', ''], 'monthNamesShort': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', ''], 'timePattern': 'h:mm tt', 'dateTimeMomentPattern': 'DD/MM/YYYY HH:mm', 'dateMomentPattern': 'DD/MM/YYYY', 'datePattern': 'M/d/yyyy', 'dateTimePattern': 'M/d/yyyy h:mm tt', 'timeFormat': 'Clock12Hours', 'weekStarts': 0 },
          'es-es': { 'dayNames': ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'], 'dayNamesShort': ['D', 'L', 'M', 'X', 'J', 'V', 'S'], 'monthNames': ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre', ''], 'monthNamesShort': ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.', ''], 'timePattern': 'H:mm', 'dateTimeMomentPattern': 'DD/MM/YYYY HH:mm', 'dateMomentPattern': 'DD/MM/YYYY', 'datePattern': 'dd/MM/yyyy', 'dateTimePattern': 'dd/MM/yyyy H:mm', 'timeFormat': 'Clock24Hours', 'weekStarts': 1 },
          'es-mx': { 'dayNames': ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'], 'dayNamesShort': ['do.', 'lu.', 'ma.', 'mi.', 'ju.', 'vi.', 'sá.'], 'monthNames': ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre', ''], 'monthNamesShort': ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.', ''], 'timePattern': 'hh:mm tt', 'dateTimeMomentPattern': 'DD/MM/YYYY HH:mm', 'dateMomentPattern': 'DD/MM/YYYY', 'datePattern': 'dd/MM/yyyy', 'dateTimePattern': 'dd/MM/yyyy hh:mm tt', 'timeFormat': 'Clock12Hours', 'weekStarts': 0 },
          'eu-es': { 'dayNames': ['igandea', 'astelehena', 'asteartea', 'asteazkena', 'osteguna', 'ostirala', 'larunbata'], 'dayNamesShort': ['ig', 'al', 'as', 'az', 'og', 'or', 'lr'], 'monthNames': ['urtarrila', 'otsaila', 'martxoa', 'apirila', 'maiatza', 'ekaina', 'uztaila', 'abuztua', 'iraila', 'urria', 'azaroa', 'abendua', ''], 'monthNamesShort': ['urt.', 'ots.', 'mar.', 'api.', 'mai.', 'eka.', 'uzt.', 'abu.', 'ira.', 'urr.', 'aza.', 'abe.', ''], 'timePattern': 'H:mm', 'dateTimeMomentPattern': 'DD/MM/YYYY HH:mm', 'dateMomentPattern': 'DD/MM/YYYY', 'datePattern': 'yyyy/MM/dd', 'dateTimePattern': 'yyyy/MM/dd H:mm', 'timeFormat': 'Clock24Hours', 'weekStarts': 1 },
          'fi-fi': { 'dayNames': ['sunnuntai', 'maanantai', 'tiistai', 'keskiviikko', 'torstai', 'perjantai', 'lauantai'], 'dayNamesShort': ['su', 'ma', 'ti', 'ke', 'to', 'pe', 'la'], 'monthNames': ['tammikuu', 'helmikuu', 'maaliskuu', 'huhtikuu', 'toukokuu', 'kesäkuu', 'heinäkuu', 'elokuu', 'syyskuu', 'lokakuu', 'marraskuu', 'joulukuu', ''], 'monthNamesShort': ['tammi', 'helmi', 'maalis', 'huhti', 'touko', 'kesä', 'heinä', 'elo', 'syys', 'loka', 'marras', 'joulu', ''], 'timePattern': 'H:mm', 'dateTimeMomentPattern': 'DD/MM/YYYY HH:mm', 'dateMomentPattern': 'DD/MM/YYYY', 'datePattern': 'd.M.yyyy', 'dateTimePattern': 'd.M.yyyy H:mm', 'timeFormat': 'Clock24Hours', 'weekStarts': 1 },
          'fr-be': { 'dayNames': ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'], 'dayNamesShort': ['di', 'lu', 'ma', 'me', 'je', 've', 'sa'], 'monthNames': ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre', ''], 'monthNamesShort': ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.', ''], 'timePattern': 'HH:mm', 'dateTimeMomentPattern': 'DD/MM/YYYY HH:mm', 'dateMomentPattern': 'DD/MM/YYYY', 'datePattern': 'dd-MM-yy', 'dateTimePattern': 'dd-MM-yy HH:mm', 'timeFormat': 'Clock24Hours', 'weekStarts': 1 },
          'fr-ch': { 'dayNames': ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'], 'dayNamesShort': ['di', 'lu', 'ma', 'me', 'je', 've', 'sa'], 'monthNames': ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre', ''], 'monthNamesShort': ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.', ''], 'timePattern': 'HH:mm', 'dateTimeMomentPattern': 'DD/MM/YYYY HH:mm', 'dateMomentPattern': 'DD/MM/YYYY', 'datePattern': 'dd.MM.yyyy', 'dateTimePattern': 'dd.MM.yyyy HH:mm', 'timeFormat': 'Clock24Hours', 'weekStarts': 1 },
          'fr-fr': { 'dayNames': ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'], 'dayNamesShort': ['di', 'lu', 'ma', 'me', 'je', 've', 'sa'], 'monthNames': ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre', ''], 'monthNamesShort': ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.', ''], 'timePattern': 'HH:mm', 'dateTimeMomentPattern': 'DD/MM/YYYY HH:mm', 'dateMomentPattern': 'DD/MM/YYYY', 'datePattern': 'dd/MM/yyyy', 'dateTimePattern': 'dd/MM/yyyy HH:mm', 'timeFormat': 'Clock24Hours', 'weekStarts': 1 },
          'fr-lu': { 'dayNames': ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'], 'dayNamesShort': ['di', 'lu', 'ma', 'me', 'je', 've', 'sa'], 'monthNames': ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre', ''], 'monthNamesShort': ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.', ''], 'timePattern': 'HH:mm', 'dateTimeMomentPattern': 'DD/MM/YYYY HH:mm', 'dateMomentPattern': 'DD/MM/YYYY', 'datePattern': 'dd/MM/yyyy', 'dateTimePattern': 'dd/MM/yyyy HH:mm', 'timeFormat': 'Clock24Hours', 'weekStarts': 1 },
          'gl-es': { 'dayNames': ['domingo', 'luns', 'martes', 'mércores', 'xoves', 'venres', 'sábado'], 'dayNamesShort': ['do', 'lu', 'ma', 'mé', 'xo', 've', 'sá'], 'monthNames': ['xaneiro', 'febreiro', 'marzo', 'abril', 'maio', 'xuño', 'xullo', 'agosto', 'setembro', 'outubro', 'novembro', 'decembro', ''], 'monthNamesShort': ['xan', 'feb', 'mar', 'abr', 'maio', 'xuño', 'xul', 'ago', 'set', 'out', 'nov', 'dec', ''], 'timePattern': 'H:mm', 'dateTimeMomentPattern': 'DD/MM/YYYY HH:mm', 'dateMomentPattern': 'DD/MM/YYYY', 'datePattern': 'dd/MM/yyyy', 'dateTimePattern': 'dd/MM/yyyy H:mm', 'timeFormat': 'Clock24Hours', 'weekStarts': 1 },
          'it-it': { 'dayNames': ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'], 'dayNamesShort': ['do', 'lu', 'ma', 'me', 'gi', 've', 'sa'], 'monthNames': ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre', ''], 'monthNamesShort': ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic', ''], 'timePattern': 'HH:mm', 'dateTimeMomentPattern': 'DD/MM/YYYY HH:mm', 'dateMomentPattern': 'DD/MM/YYYY', 'datePattern': 'dd/MM/yyyy', 'dateTimePattern': 'dd/MM/yyyy HH:mm', 'timeFormat': 'Clock24Hours', 'weekStarts': 1 },
          'it-ch': { 'dayNames': ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'], 'dayNamesShort': ['do', 'lu', 'ma', 'me', 'gi', 've', 'sa'], 'monthNames': ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre', ''], 'monthNamesShort': ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic', ''], 'timePattern': 'HH:mm', 'dateTimeMomentPattern': 'DD/MM/YYYY HH:mm', 'dateMomentPattern': 'DD/MM/YYYY', 'datePattern': 'dd.MM.yyyy', 'dateTimePattern': 'dd.MM.yyyy HH:mm', 'timeFormat': 'Clock24Hours', 'weekStarts': 1 },
          'ja-jp': { 'dayNames': ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'], 'dayNamesShort': ['日', '月', '火', '水', '木', '金', '土'], 'monthNames': ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', ''], 'monthNamesShort': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', ''], 'timePattern': 'H:mm', 'dateTimeMomentPattern': 'DD/MM/YYYY HH:mm', 'dateMomentPattern': 'DD/MM/YYYY', 'datePattern': 'yyyy/MM/dd', 'dateTimePattern': 'yyyy/MM/dd H:mm', 'timeFormat': 'Clock24Hours', 'weekStarts': 0 },
          'nb-no': { 'dayNames': ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'], 'dayNamesShort': ['sø', 'ma', 'ti', 'on', 'to', 'fr', 'lø'], 'monthNames': ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember', ''], 'monthNamesShort': ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des', ''], 'timePattern': 'HH:mm', 'dateTimeMomentPattern': 'DD/MM/YYYY HH:mm', 'dateMomentPattern': 'DD/MM/YYYY', 'datePattern': 'dd.MM.yyyy', 'dateTimePattern': 'dd.MM.yyyy HH:mm', 'timeFormat': 'Clock24Hours', 'weekStarts': 1 },
          'nl-nl': { 'dayNames': ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'], 'dayNamesShort': ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'], 'monthNames': ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december', ''], 'monthNamesShort': ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec', ''], 'timePattern': 'HH:mm', 'dateTimeMomentPattern': 'DD/MM/YYYY HH:mm', 'dateMomentPattern': 'DD/MM/YYYY', 'datePattern': 'd-M-yyyy', 'dateTimePattern': 'd-M-yyyy HH:mm', 'timeFormat': 'Clock24Hours', 'weekStarts': 1 },
          'nl-be': { 'dayNames': ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'], 'dayNamesShort': ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'], 'monthNames': ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december', ''], 'monthNamesShort': ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec', ''], 'timePattern': 'H:mm', 'dateTimeMomentPattern': 'DD/MM/YYYY HH:mm', 'dateMomentPattern': 'DD/MM/YYYY', 'datePattern': 'd/MM/yyyy', 'dateTimePattern': 'd/MM/yyyy H:mm', 'timeFormat': 'Clock24Hours', 'weekStarts': 1 },
          'nn-no': { 'dayNames': ['søndag', 'måndag', 'tysdag', 'onsdag', 'torsdag', 'fredag', 'laurdag'], 'dayNamesShort': ['sø', 'må', 'ty', 'on', 'to', 'fr', 'la'], 'monthNames': ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember', ''], 'monthNamesShort': ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des', ''], 'timePattern': 'HH:mm', 'dateTimeMomentPattern': 'DD/MM/YYYY HH:mm', 'dateMomentPattern': 'DD/MM/YYYY', 'datePattern': 'dd.MM.yyyy', 'dateTimePattern': 'dd.MM.yyyy HH:mm', 'timeFormat': 'Clock24Hours', 'weekStarts': 1 },
          'pt-br': { 'dayNames': ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'], 'dayNamesShort': ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'], 'monthNames': ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro', ''], 'monthNamesShort': ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez', ''], 'timePattern': 'HH:mm', 'dateTimeMomentPattern': 'DD/MM/YYYY HH:mm', 'dateMomentPattern': 'DD/MM/YYYY', 'datePattern': 'dd/MM/yyyy', 'dateTimePattern': 'dd/MM/yyyy HH:mm', 'timeFormat': 'Clock24Hours', 'weekStarts': 0 },
          'pl-pl': { 'dayNames': ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'], 'dayNamesShort': ['N', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So'], 'monthNames': ['styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec', 'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień', ''], 'monthNamesShort': ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru', ''], 'timePattern': 'HH:mm', 'dateTimeMomentPattern': 'DD/MM/YYYY HH:mm', 'dateMomentPattern': 'DD/MM/YYYY', 'datePattern': 'yyyy-MM-dd', 'dateTimePattern': 'yyyy-MM-dd HH:mm', 'timeFormat': 'Clock24Hours', 'weekStarts': 1 },
          'pt-pt': { 'dayNames': ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'], 'dayNamesShort': ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'], 'monthNames': ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro', ''], 'monthNamesShort': ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez', ''], 'timePattern': 'HH:mm', 'dateTimeMomentPattern': 'DD/MM/YYYY HH:mm', 'dateMomentPattern': 'DD/MM/YYYY', 'datePattern': 'dd/MM/yyyy', 'dateTimePattern': 'dd/MM/yyyy HH:mm', 'timeFormat': 'Clock24Hours', 'weekStarts': 0 },
          'ro-ro': { 'dayNames': ['duminică', 'luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă'], 'dayNamesShort': ['D', 'L', 'Ma', 'Mi', 'J', 'V', 'S'], 'monthNames': ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie', ''], 'monthNamesShort': ['ian.', 'feb.', 'mar.', 'apr.', 'mai.', 'iun.', 'iul.', 'aug.', 'sep.', 'oct.', 'nov.', 'dec.', ''], 'timePattern': 'H:mm', 'dateTimeMomentPattern': 'DD/MM/YYYY HH:mm', 'dateMomentPattern': 'DD/MM/YYYY', 'datePattern': 'dd.MM.yyyy', 'dateTimePattern': 'dd.MM.yyyy H:mm', 'timeFormat': 'Clock24Hours', 'weekStarts': 1 },
          'ru-ru': { 'dayNames': ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'], 'dayNamesShort': ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'], 'monthNames': ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь', ''], 'monthNamesShort': ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек', ''], 'timePattern': 'H:mm', 'dateTimeMomentPattern': 'DD/MM/YYYY HH:mm', 'dateMomentPattern': 'DD/MM/YYYY', 'datePattern': 'dd.MM.yyyy', 'dateTimePattern': 'dd.MM.yyyy H:mm', 'timeFormat': 'Clock24Hours', 'weekStarts': 1 },
          'sk-sk': { 'dayNames': ['nedeľa', 'pondelok', 'utorok', 'streda', 'štvrtok', 'piatok', 'sobota'], 'dayNamesShort': ['ne', 'po', 'ut', 'st', 'št', 'pi', 'so'], 'monthNames': ['január', 'február', 'marec', 'apríl', 'máj', 'jún', 'júl', 'august', 'september', 'október', 'november', 'december', ''], 'monthNamesShort': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', ''], 'timePattern': 'H:mm', 'dateTimeMomentPattern': 'DD/MM/YYYY HH:mm', 'dateMomentPattern': 'DD/MM/YYYY', 'datePattern': 'd.M.yyyy', 'dateTimePattern': 'd.M.yyyy H:mm', 'timeFormat': 'Clock24Hours', 'weekStarts': 1 },
          'sv-se': { 'dayNames': ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag'], 'dayNamesShort': ['sö', 'må', 'ti', 'on', 'to', 'fr', 'lö'], 'monthNames': ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december', ''], 'monthNamesShort': ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec', ''], 'timePattern': 'HH:mm', 'dateTimeMomentPattern': 'DD/MM/YYYY HH:mm', 'dateMomentPattern': 'DD/MM/YYYY', 'datePattern': 'yyyy-MM-dd', 'dateTimePattern': 'yyyy-MM-dd HH:mm', 'timeFormat': 'Clock24Hours', 'weekStarts': 1 },
          'tr-tr': { 'dayNames': ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'], 'dayNamesShort': ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'], 'monthNames': ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık', ''], 'monthNamesShort': ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara', ''], 'timePattern': 'HH:mm', 'dateTimeMomentPattern': 'DD/MM/YYYY HH:mm', 'dateMomentPattern': 'DD/MM/YYYY', 'datePattern': 'd.M.yyyy', 'dateTimePattern': 'd.M.yyyy HH:mm', 'timeFormat': 'Clock24Hours', 'weekStarts': 1 },
          'zh-cn': { 'dayNames': ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'], 'dayNamesShort': ['日', '一', '二', '三', '四', '五', '六'], 'monthNames': ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月', ''], 'monthNamesShort': ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', ''], 'timePattern': 'H:mm', 'dateTimeMomentPattern': 'DD/MM/YYYY HH:mm', 'dateMomentPattern': 'DD/MM/YYYY', 'datePattern': 'yyyy/M/d', 'dateTimePattern': 'yyyy/M/d H:mm', 'timeFormat': 'Clock24Hours', 'weekStarts': 1 },
          /** THANHNV ADD VI */
          'vi-vn': { 'dayNames': ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'], 'dayNamesShort': ['CN', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7'], 'monthNames': ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12', ''], 'monthNamesShort': ['TH1', 'TH2', 'TH3', 'TH4', 'TH5', 'TH6', 'TH7', 'TH8', 'TH9', 'TH10', 'TH11', 'TH12', ''], 'timePattern': 'HH:mm', 'dateTimeMomentPattern': 'DD/MM/YYYY HH:mm', 'dateMomentPattern': 'DD/MM/YYYY', 'datePattern': 'dd/MM/yyyy', 'dateTimePattern': 'dd/MM/yyyy HH:mm', 'timeFormat': 'Clock24Hours', 'weekStarts': 1 }
        }
        return data[this.languageLong.toLowerCase()] || data['vi-VN'.toLowerCase()]
      },
      get apiConfigHeader () {
        return {
          headers: {
            groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : 42942
          }
        }
      },
      get activityClassName () {
        return window.ACTIVITY_CONST ? window.ACTIVITY_CONST.activityClassName : 'org.mobilink.activitymgt.model.Activity'
      },
      get checklistClassName () {
        return window.ACTIVITY_CONST ? window.ACTIVITY_CONST.checklistClassName : 'org.mobilink.workmgt.model.Checklist'
      },
      get docFileClassName () {
        return window.ACTIVITY_CONST ? window.ACTIVITY_CONST.docFileClassName : 'org.mobilink.docmgt.model.DocFile'
      },
      get workspaceClassName () {
        return window.ACTIVITY_CONST ? window.ACTIVITY_CONST.workspaceClassName : 'org.mobilink.sharing.model.Workspace'
      },
      get personalEventClassName () {
        return window.ACTIVITY_CONST ? window.ACTIVITY_CONST.personalEventClassName : 'org.mobilink.workmgt.model.PersonalEvent'
      },
      customFilterUser (item, queryText, itemText) {
        const hasValue = val => val != null ? val : ''
        let text = hasValue(item.fullName)
        text = text + hasValue(item.email)
        const query = hasValue(queryText)
        return text.toString()
          .toLowerCase()
          .indexOf(query.toString().toLowerCase()) > -1
      },
      get mRulesCommon () {
        return {
          required: value => !!value || 'Trường thông tin bắt buộc phải nhập'
        }
      },
      get constantPermissionKey () {
        return window.ACTIVITY_CONST ? window.ACTIVITY_CONST.constantPermissionKey : {
          read: 0,
          write: 1,
          owner: 5
        }
      },
      get constantPriorityKey () {
        return window.ACTIVITY_CONST ? window.ACTIVITY_CONST.constantPriorityKey : [
          { text: 'Khẩn', value: 2, color: 'red' },
          { text: 'Cao', value: 1, color: 'blue' },
          { text: 'Thường', value: 0, color: 'green' }
        ]
      },
      get pageNumberItems () {
        return [
          5, 10, 15, 20, 25, 30, 40, 50
        ]
      },
      get appNudgeLeft () {
        return 50
      },
      get appNudgeTop () {
        return 60
      },
      get fileSecureCheck () {
        return [
          { secucheck: 0, title: 'Chưa kiểm tra', color: 'white' },
          { secucheck: 1, title: 'An toàn', color: 'success' },
          { secucheck: 2, title: 'Nghi ngờ', color: 'warn' },
          { secucheck: 3, title: 'Nguy hiểm', color: 'red' }
        ]
      },
      get constantInvokeTypes () {
        return [
          { itemCode: 0, itemName: 'Cá nhân' },
          { itemCode: 1, itemName: 'Đơn vị' } /** ,
          { itemCode: 2, itemName: 'Nhóm' } */
        ]
      },
      get docFileOtherType () {
        if (window.ACTIVITY_CONST && window.ACTIVITY_CONST.docFileOtherType === false) {
          return false
        } else {
          return true
        }
      }
    }
  },
  methods: {
    getPriorityName (value) {
      let priorityKey = ''
      for (let k in this.constantPriorityKey) {
        if (this.constantPriorityKey[k].value === value) {
          priorityKey = this.constantPriorityKey[k].text
          break
        }
      }
      return priorityKey
    },
    getPriorityColor (value) {
      let priorityKey = ''
      for (let k in this.constantPriorityKey) {
        if (this.constantPriorityKey[k].value === value) {
          priorityKey = this.constantPriorityKey[k].color
          break
        }
      }
      return priorityKey
    },
    getStatusTextColor (value) {
      const colorBystate = window.ACTIVITY_CONST ? window.ACTIVITY_CONST.activityTaskStateColor : {
        '0': '#E6B0AA',
        '1': '#F5B7B1',
        '2': '#D7BDE2',
        '3': '#D2B4DE',
        '4': '#D2B4DE',
        '5': '#A9CCE3',
        '6': '#AED6F1',
        '7': '#A3E4D7',
        '8': '#A9DFBF',
        '9': '#82E0AA',
        '10': '#F7DC6F',
        '11': '#F8C471',
        '12': '#E59866',
        '13': '#D7DBDD',
        '14': '#AAB7B8',
        '15': '#7F8C8D'
      }
      if (value) {
        return colorBystate[String(value)]
      } else {
        return colorBystate['0']
      }
    },
    getPermissionColor (value) {
      let drawColor = {
        read: 'accent',
        write: 'green darken-2',
        owner: 'cyan darken-1'
      }
      return drawColor[value] || 'accent'
    },
    getPermissionText (value) {
      if ('owner, leader'.indexOf(value || 'none') >= 0) {
        return 'owner'
      } else if ('hoster, manager, write'.indexOf(value || 'none') >= 0) {
        return 'write'
      } else if ('read'.indexOf(value || 'none') >= 0) {
        return 'read'
      } else {
        return 'none'
      }
    },
    getSourceTypeValue (str) {
      let soureType = {
        OTHER: 0, // khac
        DOCUMENT: 1, // van ban dieu hanh
        MEETING_CONCLUSION: 2, // ket luan cuoc hop
        ASSIGN_TASK: 3, // giao nhiem vu
        REQUEST: 4, // de xuat, kien nghi
        PLAN: 5, // ke hoach
        TICKET: 6, // yeu cau ho tro
        SALE: 7, // hoat dong kinh doanh
        CHILD_EVENT: 8, // cuoc hop con
        EVENT_TASK: 9, // su kien con cua nhiem vu
        EVENT_DOCUMENT: 10, // su kien con cua tai lieu
        TASK_DOCUMENT: 11 // nhiem vu con cua tai lieu
      }
      return soureType[str] || 0
    }

  }
}

export default MobilinkVariablesConstants
