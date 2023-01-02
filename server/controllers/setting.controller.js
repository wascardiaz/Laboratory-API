const db = require("../models");
const { fileExists } = require('../helpers/file-exists');
const path = require("path");
const fs = require("fs-extra");
var _ = require('lodash');
const Setting = db.setting;
const Op = db.Sequelize.Op;

var baseUrl = process.env.IMAGES_SETTING_BASE_URL;

exports.uploadImage = async (file, { key, code }) => {
  const directoryPath = path.resolve(__basedir, process.env.IMAGES_SETTING_STORAGE);
  try {
    // await uploadFile(req, res);

    if (file == undefined) {
      throw "Please upload a file!";
    }

    const value = file.filename;
    const setting = await Setting.findOne({ where: { companyId: 0, code, key } });

    if (setting) {
      if (setting.value !== value && fileExists(path.join(directoryPath, setting.value)))
        fs.unlink(directoryPath + setting.value);

      setting.value = value;
      return await setting.save().catch(e => { throw e.message || 'No se ha podido acutalizar la imagen.' })
    }

    return await Setting.create({ companyId: 0, code, key, value: value, serialized: '0' }).catch(e => { throw e.message || 'No se pudo guardar la imagen' });

  } catch (err) {
    console.log(err)
    if (err.code == "LIMIT_FILE_SIZE") {
      throw err.message || "File size cannot be larger than 2MB!";
    }
    throw `Could not upload the file: ${err}`;
  }
};

exports.getListFiles = (res) => {
  const directoryPath = path.join(__basedir, process.env.FILE_STORAGE);
  const baseUrlFiles = path.join(__basedir, process.env.FILE_BASE_URL);

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      throw err.message || "Unable to scan files!";
    }

    let fileInfos = [];

    files.forEach((file) => {
      if (path.extname(file)) {
        var port = req.app.get('http-port') ? req.app.get('http-port') : req.app.get('https-port');
        var base = req.protocol + '://' + req.hostname + (port ? ':' + port : '');
        var url = path.join(baseUrlFiles, fileName).replace(/[\\\/]+/g, '/').replace(/^[\/]+/g, '');

        // console.log((/* req.file.storage == 'local' ? */ base/*  : '' */) + '/' + url)
        fileInfos.push({ name: file, url: (/* req.file.storage == 'local' ? */ base/*  : '' */) + '/' + url });
      }
    });

    return fileInfos;
  });
};

exports.getFile = async (req) => {
  const directoryPath = path.resolve(__basedir, process.env.IMAGES_SETTING_STORAGE);
  const urlImage = req.params.name;

  var port = req.app.get('http-port') ? req.app.get('http-port') : req.app.get('https-port');
  var base = req.protocol + '://' + req.hostname + (port ? ':' + port : '');
  var url = path.join(baseUrl, urlImage).replace(/[\\\/]+/g, '/').replace(/^[\/]+/g, '');

  if (!fileExists(path.join(directoryPath, urlImage)))
    // throw `No se encontro el archivo: ${fileName}`;
    return { url: (base) + path.join('/uploads/images', 'default.png') };

  return { url: (/* req.file.storage == 'local' ? */ base/*  : '' */) + '/' + url };

};

exports.download = async (fileName, res) => {
  const directoryPath = path.join(__basedir, "/public/images/");

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({ message: "Could not download the file. " + err, });
    }
  });
};

// Create and Save a new Setting
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.username) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Setting
  const setting = {
    username: req.body.username,
    email: req.body.email,
    user_group_id: parseInt(req.body.userGroupId, 10),
    password: bcrypt.hashSync(req.body.password, 10),
    status: req.body.status ? '1' : '0'
  };
  // Save Setting in the database
  Setting.create(setting)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Setting."
      });
    });
};

// Retrieve all Resultados from the database.
exports.findAll = async ({ companyId }) => {
  // Configurariones del Sistema
  const settings = [
    { companyId: 0, code: 'config', key: 'config_robots', value: 'abot\r\ndbot\r\nebot\r\nhbot\r\nkbot\r\nlbot\r\nmbot\r\nnbot\r\nobot\r\npbot\r\nrbot\r\nsbot\r\ntbot\r\nvbot\r\nybot\r\nzbot\r\nbot.\r\nbot/\r\n_bot\r\n.bot\r\n/bot\r\n-bot\r\n:bot\r\n(bot\r\ncrawl\r\nslurp\r\nspider\r\nseek\r\naccoona\r\nacoon\r\nadressendeutschland\r\nah-ha.com\r\nahoy\r\naltavista\r\nananzi\r\nanthill\r\nappie\r\narachnophilia\r\narale\r\naraneo\r\naranha\r\narchitext\r\naretha\r\narks\r\nasterias\r\natlocal\r\natn\r\natomz\r\naugurfind\r\nbackrub\r\nbannana_bot\r\nbaypup\r\nbdfetch\r\nbig brother\r\nbiglotron\r\nbjaaland\r\nblackwidow\r\nblaiz\r\nblog\r\nblo.\r\nbloodhound\r\nboitho\r\nbooch\r\nbradley\r\nbutterfly\r\ncalif\r\ncassandra\r\nccubee\r\ncfetch\r\ncharlotte\r\nchurl\r\ncienciaficcion\r\ncmc\r\ncollective\r\ncomagent\r\ncombine\r\ncomputingsite\r\ncsci\r\ncurl\r\ncusco\r\ndaumoa\r\ndeepindex\r\ndelorie\r\ndepspid\r\ndeweb\r\ndie blinde kuh\r\ndigger\r\nditto\r\ndmoz\r\ndocomo\r\ndownload express\r\ndtaagent\r\ndwcp\r\nebiness\r\nebingbong\r\ne-collector\r\nejupiter\r\nemacs-w3 search engine\r\nesther\r\nevliya celebi\r\nezresult\r\nfalcon\r\nfelix ide\r\nferret\r\nfetchrover\r\nfido\r\nfindlinks\r\nfireball\r\nfish search\r\nfouineur\r\nfunnelweb\r\ngazz\r\ngcreep\r\ngenieknows\r\ngetterroboplus\r\ngeturl\r\nglx\r\ngoforit\r\ngolem\r\ngrabber\r\ngrapnel\r\ngralon\r\ngriffon\r\ngromit\r\ngrub\r\ngulliver\r\nhamahakki\r\nharvest\r\nhavindex\r\nhelix\r\nheritrix\r\nhku www octopus\r\nhomerweb\r\nhtdig\r\nhtml index\r\nhtml_analyzer\r\nhtmlgobble\r\nhubater\r\nhyper-decontextualizer\r\nia_archiver\r\nibm_planetwide\r\nichiro\r\niconsurf\r\niltrovatore\r\nimage.kapsi.net\r\nimagelock\r\nincywincy\r\nindexer\r\ninfobee\r\ninformant\r\ningrid\r\ninktomisearch.com\r\ninspector web\r\nintelliagent\r\ninternet shinchakubin\r\nip3000\r\niron33\r\nisraeli-search\r\nivia\r\njack\r\njakarta\r\njavabee\r\njetbot\r\njumpstation\r\nkatipo\r\nkdd-explorer\r\nkilroy\r\nknowledge\r\nkototoi\r\nkretrieve\r\nlabelgrabber\r\nlachesis\r\nlarbin\r\nlegs\r\nlibwww\r\nlinkalarm\r\nlink validator\r\nlinkscan\r\nlockon\r\nlwp\r\nlycos\r\nmagpie\r\nmantraagent\r\nmapoftheinternet\r\nmarvin/\r\nmattie\r\nmediafox\r\nmediapartners\r\nmercator\r\nmerzscope\r\nmicrosoft url control\r\nminirank\r\nmiva\r\nmj12\r\nmnogosearch\r\nmoget\r\nmonster\r\nmoose\r\nmotor\r\nmultitext\r\nmuncher\r\nmuscatferret\r\nmwd.search\r\nmyweb\r\nnajdi\r\nnameprotect\r\nnationaldirectory\r\nnazilla\r\nncsa beta\r\nnec-meshexplorer\r\nnederland.zoek\r\nnetcarta webmap engine\r\nnetmechanic\r\nnetresearchserver\r\nnetscoop\r\nnewscan-online\r\nnhse\r\nnokia6682/\r\nnomad\r\nnoyona\r\nnutch\r\nnzexplorer\r\nobjectssearch\r\noccam\r\nomni\r\nopen text\r\nopenfind\r\nopenintelligencedata\r\norb search\r\nosis-project\r\npack rat\r\npageboy\r\npagebull\r\npage_verifier\r\npanscient\r\nparasite\r\npartnersite\r\npatric\r\npear.\r\npegasus\r\nperegrinator\r\npgp key agent\r\nphantom\r\nphpdig\r\npicosearch\r\npiltdownman\r\npimptrain\r\npinpoint\r\npioneer\r\npiranha\r\nplumtreewebaccessor\r\npogodak\r\npoirot\r\npompos\r\npoppelsdorf\r\npoppi\r\npopular iconoclast\r\npsycheclone\r\npublisher\r\npython\r\nrambler\r\nraven search\r\nroach\r\nroad runner\r\nroadhouse\r\nrobbie\r\nrobofox\r\nrobozilla\r\nrules\r\nsalty\r\nsbider\r\nscooter\r\nscoutjet\r\nscrubby\r\nsearch.\r\nsearchprocess\r\nsemanticdiscovery\r\nsenrigan\r\nsg-scout\r\nshai\r\nhulud\r\nshark\r\nshopwiki\r\nsidewinder\r\nsift\r\nsilk\r\nsimmany\r\nsite searcher\r\nsite valet\r\nsitetech-rover\r\nskymob.com\r\nsleek\r\nsmartwit\r\nsna-\r\nsnappy\r\nsnooper\r\nsohu\r\nspeedfind\r\nsphere\r\nsphider\r\nspinner\r\nspyder\r\nsteeler/\r\nsuke\r\nsuntek\r\nsupersnooper\r\nsurfnomore\r\nsven\r\nsygol\r\nszukacz\r\ntach black widow\r\ntarantula\r\ntempleton\r\n/teoma\r\nt-h-u-n-d-e-r-s-t-o-n-e\r\ntheophrastus\r\ntitan\r\ntitin\r\ntkwww\r\ntoutatis\r\nt-rex\r\ntutorgig\r\ntwiceler\r\ntwisted\r\nucsd\r\nudmsearch\r\nurl check\r\nupdated\r\nvagabondo\r\nvalkyrie\r\nverticrawl\r\nvictoria\r\nvision-search\r\nvolcano\r\nvoyager/\r\nvoyager-hc\r\nw3c_validator\r\nw3m2\r\nw3mir\r\nwalker\r\nwallpaper\r\nwanderer\r\nwauuu\r\nwavefire\r\nweb core\r\nweb hopper\r\nweb wombat\r\nwebbandit\r\nwebcatcher\r\nwebcopy\r\nwebfoot\r\nweblayers\r\nweblinker\r\nweblog monitor\r\nwebmirror\r\nwebmonkey\r\nwebquest\r\nwebreaper\r\nwebsitepulse\r\nwebsnarf\r\nwebstolperer\r\nwebvac\r\nwebwalk\r\nwebwatch\r\nwebwombat\r\nwebzinger\r\nwhizbang\r\nwhowhere\r\nwild ferret\r\nworldlight\r\nwwwc\r\nwwwster\r\nxenu\r\nxget\r\nxift\r\nxirq\r\nyandex\r\nyanga\r\nyeti\r\nyodao\r\nzao\r\nzippp\r\nzyborg', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_shared', value: '0', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_fraud_detection', value: '0', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_meta_title', value: 'Your Store', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_session_expire', value: '3600000000', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_meta_description', value: 'My Store', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_meta_keyword', value: '', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_theme', value: 'basic', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_layout_id', value: '4', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_country_id', value: '222', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_zone_id', value: '3563', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_timezone', value: 'UTC', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_language', value: 'en-gb', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_language_admin', value: 'en-gb', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_currency', value: 'USD', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_currency_auto', value: '1', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_currency_engine', value: 'ecb', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_length_class_id', value: '1', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_weight_class_id', value: '1', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_product_description_length', value: '100', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_pagination', value: '10', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_pagination_admin', value: '10', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_product_count', value: '1', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_review_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_review_guest', value: '1', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_voucher_min', value: '1', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_voucher_max', value: '1000', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_cookie_id', value: '0', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_gdpr_id', value: '0', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_gdpr_limit', value: '180', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_tax', value: '1', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_tax_default', value: 'shipping', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_tax_customer', value: 'shipping', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_customer_online', value: '0', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_customer_online_expire', value: '1', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_customer_activity', value: '0', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_customer_search', value: '0', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_customer_group_id', value: '1', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_customer_group_display', value: '["1"]', serialized: '1' },
    { companyId: 0, code: 'config', key: 'config_customer_price', value: '0', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_account_id', value: '3', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_invoice_prefix', value: `INV-${new Date().getFullYear()}-00`, serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_api_id', value: '1', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_cart_weight', value: '1', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_checkout_guest', value: '1', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_checkout_id', value: '5', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_order_status_id', value: '1', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_processing_status', value: '["5","1","2","12","3"]', serialized: '1' },
    { companyId: 0, code: 'config', key: 'config_complete_status', value: '["5","3"]', serialized: '1' },
    { companyId: 0, code: 'config', key: 'config_fraud_status_id', value: '8', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_subscription_status_id', value: '1', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_subscription_active_status_id', value: '2', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_subscription_expired_status_id', value: '6', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_subscription_canceled_status_id', value: '4', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_subscription_failed_status_id', value: '3', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_subscription_denied_status_id', value: '5', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_stock_display', value: '0', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_stock_warning', value: '0', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_stock_checkout', value: '0', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_affiliate_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_affiliate_approval', value: '0', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_affiliate_auto', value: '0', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_affiliate_commission', value: '5', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_affiliate_id', value: '4', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_return_id', value: '0', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_return_status_id', value: '2', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_logo', value: 'catalog/opencart-logo.png', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image_thumb_width', value: '500', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image_thumb_height', value: '500', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image_popup_width', value: '800', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image_popup_height', value: '800', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image_category_width', value: '80', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image_category_height', value: '80', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image_product_width', value: '250', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image_product_height', value: '250', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image_additional_width', value: '74', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image_additional_height', value: '74', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image_related_width', value: '250', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image_related_height', value: '250', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image_compare_width', value: '90', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image_compare_height', value: '90', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image_wishlist_width', value: '47', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image_wishlist_height', value: '47', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image_cart_height', value: '47', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image_cart_width', value: '47', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image_location_height', value: '50', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image_location_width', value: '268', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_comment', value: '', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_open', value: '', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image', value: '', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_fax', value: '', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_telephone', value: '123456789', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_email', value: 'demo@opencart.com', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_geocode', value: '', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_owner', value: 'Your Name', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_address', value: 'Address 1', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_name', value: 'Your Store', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_seo_url', value: '0', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_file_max_size', value: '20', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_file_ext_allowed', value: 'zip\r\ntxt\r\npng\r\njpe\r\njpeg\r\nwebp\r\njpg\r\ngif\r\nbmp\r\nico\r\ntiff\r\ntif\r\nsvg\r\nsvgz\r\nzip\r\nrar\r\nmsi\r\ncab\r\nmp3\r\nmp4\r\nqt\r\nmov\r\npdf\r\npsd\r\nai\r\neps\r\nps\r\ndoc', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_file_mime_allowed', value: 'text/plain\r\nimage/png\r\nimage/webp\r\nimage/jpeg\r\nimage/gif\r\nimage/bmp\r\nimage/tiff\r\nimage/svg+xml\r\napplication/zip\r\napplication/x-zip\r\napplication/x-zip-compressed\r\napplication/rar\r\napplication/x-rar\r\napplication/x-rar-compressed\r\napplication/octet-stream\r\naudio/mpeg\r\nvideo/mp4\r\nvideo/quicktime\r\napplication/pdf', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_maintenance', value: '0', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_password', value: '1', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_encryption', value: '', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_compression', value: '0', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_error_display', value: '1', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_error_log', value: '1', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_error_filename', value: 'error.log', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_google_analytics', value: '', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_mail_engine', value: 'mail', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_mail_parameter', value: '', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_mail_smtp_hostname', value: '', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_mail_smtp_username', value: '', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_mail_smtp_password', value: '', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_mail_smtp_port', value: '25', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_mail_smtp_timeout', value: '5', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_mail_alert_email', value: '', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_mail_alert', value: '["order"]', serialized: '1' },
    { companyId: 0, code: 'config', key: 'config_captcha', value: 'basic', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_captcha_page', value: '["review","return","contact"]', serialized: '1' },
    { companyId: 0, code: 'config', key: 'config_login_attempts', value: '5', serialized: '0' },
    { companyId: 0, code: 'developer', key: 'developer_sass', value: '1', serialized: '0' },
    { companyId: 0, code: 'currency_ecb', key: 'currency_ecb_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'payment_free_checkout', key: 'payment_free_checkout_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'payment_free_checkout', key: 'payment_free_checkout_order_status_id', value: '1', serialized: '0' },
    { companyId: 0, code: 'payment_free_checkout', key: 'payment_free_checkout_sort_order', value: '1', serialized: '0' },
    { companyId: 0, code: 'payment_cod', key: 'payment_cod_sort_order', value: '5', serialized: '0' },
    { companyId: 0, code: 'payment_cod', key: 'payment_cod_total', value: '0.01', serialized: '0' },
    { companyId: 0, code: 'payment_cod', key: 'payment_cod_order_status_id', value: '1', serialized: '0' },
    { companyId: 0, code: 'payment_cod', key: 'payment_cod_geo_zone_id', value: '0', serialized: '0' },
    { companyId: 0, code: 'payment_cod', key: 'payment_cod_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'shipping_flat', key: 'shipping_flat_sort_order', value: '1', serialized: '0' },
    { companyId: 0, code: 'shipping_flat', key: 'shipping_flat_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'shipping_flat', key: 'shipping_flat_geo_zone_id', value: '0', serialized: '0' },
    { companyId: 0, code: 'shipping_flat', key: 'shipping_flat_tax_class_id', value: '9', serialized: '0' },
    { companyId: 0, code: 'shipping_flat', key: 'shipping_flat_cost', value: '5.00', serialized: '0' },
    { companyId: 0, code: 'total_shipping', key: 'total_shipping_sort_order', value: '3', serialized: '0' },
    { companyId: 0, code: 'total_sub_total', key: 'total_sub_total_sort_order', value: '1', serialized: '0' },
    { companyId: 0, code: 'total_sub_total', key: 'total_sub_total_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'total_tax', key: 'total_tax_sort_order', value: '5', serialized: '0' },
    { companyId: 0, code: 'total_tax', key: 'total_tax_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'total_total', key: 'total_total_sort_order', value: '9', serialized: '0' },
    { companyId: 0, code: 'total_total', key: 'total_total_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'total_credit', key: 'total_credit_sort_order', value: '7', serialized: '0' },
    { companyId: 0, code: 'total_credit', key: 'total_credit_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'total_reward', key: 'total_reward_sort_order', value: '2', serialized: '0' },
    { companyId: 0, code: 'total_reward', key: 'total_reward_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'total_shipping', key: 'total_shipping_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'total_shipping', key: 'total_shipping_estimator', value: '1', serialized: '0' },
    { companyId: 0, code: 'total_coupon', key: 'total_coupon_sort_order', value: '4', serialized: '0' },
    { companyId: 0, code: 'total_coupon', key: 'total_coupon_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'total_voucher', key: 'total_voucher_sort_order', value: '8', serialized: '0' },
    { companyId: 0, code: 'total_voucher', key: 'total_voucher_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'module_category', key: 'module_category_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'module_account', key: 'module_account_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'theme_basic', key: 'theme_basic_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'dashboard_activity', key: 'dashboard_activity_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'dashboard_activity', key: 'dashboard_activity_sort_order', value: '7', serialized: '0' },
    { companyId: 0, code: 'dashboard_sale', key: 'dashboard_sale_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'dashboard_sale', key: 'dashboard_sale_width', value: '3', serialized: '0' },
    { companyId: 0, code: 'dashboard_chart', key: 'dashboard_chart_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'dashboard_chart', key: 'dashboard_chart_width', value: '6', serialized: '0' },
    { companyId: 0, code: 'dashboard_customer', key: 'dashboard_customer_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'dashboard_customer', key: 'dashboard_customer_width', value: '3', serialized: '0' },
    { companyId: 0, code: 'dashboard_map', key: 'dashboard_map_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'dashboard_map', key: 'dashboard_map_width', value: '6', serialized: '0' },
    { companyId: 0, code: 'dashboard_online', key: 'dashboard_online_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'dashboard_online', key: 'dashboard_online_width', value: '3', serialized: '0' },
    { companyId: 0, code: 'dashboard_order', key: 'dashboard_order_sort_order', value: '1', serialized: '0' },
    { companyId: 0, code: 'dashboard_order', key: 'dashboard_order_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'dashboard_order', key: 'dashboard_order_width', value: '3', serialized: '0' },
    { companyId: 0, code: 'dashboard_sale', key: 'dashboard_sale_sort_order', value: '2', serialized: '0' },
    { companyId: 0, code: 'dashboard_customer', key: 'dashboard_customer_sort_order', value: '3', serialized: '0' },
    { companyId: 0, code: 'dashboard_online', key: 'dashboard_online_sort_order', value: '4', serialized: '0' },
    { companyId: 0, code: 'dashboard_map', key: 'dashboard_map_sort_order', value: '5', serialized: '0' },
    { companyId: 0, code: 'dashboard_chart', key: 'dashboard_chart_sort_order', value: '6', serialized: '0' },
    { companyId: 0, code: 'dashboard_recent', key: 'dashboard_recent_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'dashboard_recent', key: 'dashboard_recent_sort_order', value: '8', serialized: '0' },
    { companyId: 0, code: 'dashboard_activity', key: 'dashboard_activity_width', value: '4', serialized: '0' },
    { companyId: 0, code: 'dashboard_recent', key: 'dashboard_recent_width', value: '8', serialized: '0' },
    { companyId: 0, code: 'report_customer_activity', key: 'report_customer_activity_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'report_customer_activity', key: 'report_customer_activity_sort_order', value: '1', serialized: '0' },
    { companyId: 0, code: 'report_customer_order', key: 'report_customer_order_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'report_customer_order', key: 'report_customer_order_sort_order', value: '2', serialized: '0' },
    { companyId: 0, code: 'report_customer_reward', key: 'report_customer_reward_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'report_customer_reward', key: 'report_customer_reward_sort_order', value: '3', serialized: '0' },
    { companyId: 0, code: 'report_customer_search', key: 'report_customer_search_sort_order', value: '3', serialized: '0' },
    { companyId: 0, code: 'report_customer_search', key: 'report_customer_search_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'report_customer_transaction', key: 'report_customer_transaction_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'report_customer_transaction', key: 'report_customer_transaction_status_sort_order', value: '4', serialized: '0' },
    { companyId: 0, code: 'report_sale_tax', key: 'report_sale_tax_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'report_sale_tax', key: 'report_sale_tax_sort_order', value: '5', serialized: '0' },
    { companyId: 0, code: 'report_sale_shipping', key: 'report_sale_shipping_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'report_sale_shipping', key: 'report_sale_shipping_sort_order', value: '6', serialized: '0' },
    { companyId: 0, code: 'report_sale_return', key: 'report_sale_return_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'report_sale_return', key: 'report_sale_return_sort_order', value: '7', serialized: '0' },
    { companyId: 0, code: 'report_sale_order', key: 'report_sale_order_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'report_sale_order', key: 'report_sale_order_sort_order', value: '8', serialized: '0' },
    { companyId: 0, code: 'report_sale_coupon', key: 'report_sale_coupon_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'report_sale_coupon', key: 'report_sale_coupon_sort_order', value: '9', serialized: '0' },
    { companyId: 0, code: 'report_product_viewed', key: 'report_product_viewed_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'report_product_viewed', key: 'report_product_viewed_sort_order', value: '10', serialized: '0' },
    { companyId: 0, code: 'report_product_purchased', key: 'report_product_purchased_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'report_product_purchased', key: 'report_product_purchased_sort_order', value: '11', serialized: '0' },
    { companyId: 0, code: 'report_marketing', key: 'report_marketing_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'report_marketing', key: 'report_marketing_sort_order', value: '12', serialized: '0' },];

  if ((await Setting.count()) === 0) {
    settings.forEach(async element => await Setting.create(element).catch(err => console.log(err)));
  }

  return await Setting.findAll({ where: { companyId: companyId || 0 } }).catch(err => {
    throw err.message || "Ocurrió algún error.";
  });

  // settings = await Setting.findAll({ where: condition, include: { all: true, nested: true }; order: [['id', 'DESC']] }).then(data => {
  //   return { count: data.lengtg, records: data }
  // }).catch(err => {
  //   console.log(err);
  //   return res.status(400).json({ message: err.message || 'Ocurrió algún error al buscar los Paciente.' })
  // });

  // res.status(200).json(settings);
};

// Retrieve all Resultados from the database.
exports.findAndCountAll = async (options) => {
  var condition = null;
  if (options.search && options.origin)
    condition = { id: { [Op.like]: `%${options.search}%` }, origenId: options.origin };
  else if (options.search)
    condition = { id: { [Op.like]: `%${options.search}%` } };
  else if (options.origin)
    condition = { origenId: options.origin }
  return await Setting.findAndCountAll({
    where: condition,
    include: { all: true, nested: true },
    order: options.orderBy && options.orderDir ? [[options.orderBy, options.orderDir]] : [['id', 'DESC']],
    offset: options.page ? parseInt(options.page) * options.size : 1,
    limit: options.size ? parseInt(options.size) : 5,
  }).then(data => {
    return { count: data.count, records: data.rows };
  }).catch(err => {
    throw err.message || "Se produjo un error al recuperar las propiedades.";
  });
};

// Find a single Setting with an id
exports.findOne = async (id) => {
  return await Setting.findByPk(id).catch(err => { throw "Error retrieving Setting with id=" + id; });
};

// Update a Setting by the id in the request
exports.update = async (req) => {
  const companyId = req.params.id;
  const { code } = req.body;

  delete req.body.code;
  if (req.body.config_logo) delete req.body.config_logo
  if (req.body.config_image) delete req.body.config_image

  const body = req.body;

  _.map(req.files, async function (file) {
    const newFile = file[0];
    const key = newFile.fieldname;
    const port = req.app.get('http-port') ? req.app.get('http-port') : req.app.get('https-port');
    const base = req.protocol + '://' + req.hostname + (port ? ':' + port : '');
    const url = path.join(newFile.baseUrl, newFile.filename).replace(/[\\\/]+/g, '/').replace(/^[\/]+/g, '');

    const element = { companyId, code, key: key, value: /* (newFile.storage == 'local' ? base : '') + '/' + */ url, serialized: '0' }

    const setting = await Setting.findOne({
      where: {
        [Op.and]: [
          { companyId: { [Op.like]: `${element.companyId}` } },
          { code: { [Op.like]: `${element.code}` } },
          { key: { [Op.like]: `${key}` } }
        ]
      }
    })

    if (setting) {
      const directoryPath = path.resolve(__basedir, 'public', setting.value);
      if (setting.value !== element.value && fileExists(directoryPath))
        fs.unlink(directoryPath);

      Object.assign(setting, element);
      // await setting.save().catch(e => { throw e.message || `Error actualizando ${key}` });
      await Setting.update(element, {
        where: {
          [Op.and]: [
            { companyId: { [Op.like]: `${element.companyId}` } },
            { code: { [Op.like]: `${element.code}` } },
            { key: { [Op.like]: `${key}` } }
          ]
        }
      }).catch(e => { throw e.message || `Error actualizando ${key}` });
    }
    else {
      await Setting.create(element).catch(e => { throw e.message || `Error creando ${key}` });
    }
  });

  try {
    for (const [key, value] of Object.entries(body)) {
      if (key.substring(0, code.length) == code) {

        const element = { companyId, code, key, value: value !== 'null' ? value : '', serialized: '0' };

        if (element.value === 'true')
          element.value = '1';
        else if (element.value === 'false')
          element.value = '0';

        if (Array.isArray(element.value)) {
          element.serialized = '1';
        } else {
          element.serialized = '0';
        }

        // console.log(companyId, code, key)

        const setting = await Setting.findOne({ where: { companyId: element.companyId, code: element.code, key: element.key } });

        if (setting) {
          // if (setting.value !== element.value && fileExists(path.join(process.env.IMAGES_SETTING_STORAGE, setting.value)))
          //   fs.unlinkSync(directoryPath + setting.value);
          if (setting.value !== element.value) {
            Object.assign(setting, element)
            // console.log(setting.value, element.value);
            await setting.save().catch(e => { throw e.message || 'Se produjo un error al actualizar la configuración.' })
          }
        }
        else
          await Setting.create(element).catch(e => { throw e.message || 'Se produjo un error al guardar la configuración.' });
      }
    };

    // return { message: 'Configuración actualizada correctamente.' };
    return await Setting.findAll().catch(e => { throw e.message || 'Error cargando configuraciones.' })
    // return;

  } catch (error) { throw 'Se produjo un error al guardar la configuración.'; }
};

// Delete a Setting with the specified id in the request
exports.deleteSetting = async (id) => {
  return await Setting.destroy({
    where: { id }
  })
    .then(num => {
      if (num == 1) {
        return { message: "Setting was deleted successfully!" };
      } else {
        return { message: `Cannot delete Setting with id=${id}. Maybe Setting was not found!` };
      }
    })
    .catch(err => { throw "Could not delete Setting with id=" + id; });
};

// Delete all Resultados from the database.
exports.deleteAll = async () => {
  return await Setting.destroy({
    where: {},
    truncate: false
  })
    .then(nums => { return { message: `${nums} Properties were deleted successfully!` }; })
    .catch(err => {
      throw err.message || "Some error occurred while removing all properties.";
    });
};

// find all published Setting
exports.findAllActive = async (status = true) => {
  return await Setting.findAll({ where: { status: true } })
    .catch(err => { throw err.message || "Some error occurred while retrieving properties."; });
};