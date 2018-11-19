var selCaret, rangeCaret, htmlCaret;
var globalSelf = '';
    (function(window) {
  
        'use strict';
        
        
        function getTemplate(el) {
          // Template html
          var html = '<div class="box-editor">' +
              '<div id="thisForm">' +
              '<input type="hidden" name="myDoc">' +
              '<div id="toolBar2">' +
              '<label class="customz-selectz fonthd">' +
              '<select class="selectThis" data-chg="formatblock">' +
              '<option selected>:: Formatting </option>' +
              '<option value="h1">Header &lt;h1&gt;</option>' +
              '<option value="h2">Header &lt;h2&gt;</option>' +
              '<option value="h3">Header &lt;h3&gt;</option>' +
              '<option value="h4">Header &lt;h4&gt;</option>' +
              '<option value="h5">Header &lt;h5&gt;</option>' +
              '<option value="h6">Header &lt;h6&gt;</option>' +
              '<option value="p">Paragráfo <p></option>' +
              '<option value="pre">Preformatted <pre></option>' +
              '</select>' +
              '</label>' +
              '<label class="customz-selectz fontFam">' +
              '<select class="selectThis" data-chg="fontname">' +
              '<option class="heading" selected>:: Font</option>' +
              '<option value=\' Arial, "Helvetica Neue", Helvetica, sans-serif\'>Arial</option>' +
              '<option value=\' "Arial Black", "Arial Bold", Gadget, sans-serif\'>Arial Black</option>' +
              '<option value=\' "Arial Narrow", Arial, sans-serif\'>Arial Narrow</option>' +
              '<option value=\' "Arial Rounded MT Bold", "Helvetica Rounded", Arial, sans-serif\'>Arial Rounded MT Bold</option>' +
              '<option value=\' "Avant Garde", Avantgarde, "Century Gothic", CenturyGothic, "AppleGothic", sans-serif\'>Avant Garde</option>' +
              '<option value=\' Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif\'>Calibri</option>' +
              '<option value=\' Candara, Calibri, Segoe, "Segoe UI", Optima, Arial, sans-serif\'>Candara</option>' +
              '<option value=\' "Century Gothic", CenturyGothic, AppleGothic, sans-serif\'>Century Gothic</option>' +
              '<option value=\' "Franklin Gothic Medium", "Franklin Gothic", "ITC Franklin Gothic", Arial, sans-serif\'>Franklin Gothic Medium</option>' +
              '<option value=\' Futura, "Trebuchet MS", Arial, sans-serif\'>Futura</option>' +
              '<option value=\' Geneva, Tahoma, Verdana, sans-serif\'>Geneva</option>' +
              '<option value=\' "Gill Sans", "Gill Sans MT", Calibri, sans-serif\'>Gill Sans</option>' +
              '<option value=\' "Helvetica Neue", Helvetica, Arial, sans-serif\'>Helvetica Neue</option>' +
              '<option value=\' Impact, Haettenschweiler, "Franklin Gothic Bold", Charcoal, "Helvetica Inserat", "Bitstream Vera Sans Bold", "Arial Black", sans serif\'>Impact</option>' +
              '<option value=\' "Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", Geneva, Verdana, sans-serif\'>Lucida Grande</option>' +
              '<option value=\' Optima, Segoe, "Segoe UI", Candara, Calibri, Arial, sans-serif\'>Optima</option>' +
              '<option value=\' "Segoe UI", Frutiger, "Frutiger Linotype", "Dejavu Sans", "Helvetica Neue", Arial, sans-serif\'>Segoe UI</option>' +
              '<option value=\' Tahoma, Verdana, Segoe, sans-serif\'>Tahoma</option>' +
              '<option value=\' "Trebuchet MS", "Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", Tahoma, sans-serif\'>Trebuchet MS</option>' +
              '<option value=\' Verdana, Geneva, sans-serif\'>Verdana</option>' +
              '<option value=\' Baskerville, "Baskerville Old Face", "Hoefler Text", Garamond, "Times New Roman", serif\'>Baskerville</option>' +
              '<option value=\' "Bodoni MT", Didot, "Didot LT STD", "Hoefler Text", Garamond, "Times New Roman", serif\'>Bodoni MT</option>' +
              '<option value=\' "Book Antiqua", Palatino, "Palatino Linotype", "Palatino LT STD", Georgia, serif\'>Book Antiqua</option>' +
              '<option value=\' "Calisto MT", "Bookman Old Style", Bookman, "Goudy Old Style", Garamond, "Hoefler Text", "Bitstream Charter", Georgia, serif\'>Calisto MT</option>' +
              '<option value=\' Cambria, Georgia, serif\'>Cambria</option>' +
              '<option value=\' Didot, "Didot LT STD", "Hoefler Text", Garamond, "Times New Roman", serif\'>Didot</option>' +
              '<option value=\' Garamond, Baskerville, "Baskerville Old Face", "Hoefler Text", "Times New Roman", serif\'>Garamond</option>' +
              '<option value=\' Georgia, Times, "Times New Roman", serif\'>Georgia</option>' +
              '<option value=\' "Goudy Old Style", Garamond, "Big Caslon", "Times New Roman", serif\'>Goudy Old Style</option>' +
              '<option value=\' "Hoefler Text", "Baskerville old face", Garamond, "Times New Roman", serif\'>Hoefler Text</option>' +
              '<option value=\' "Lucida Bright", Georgia, serif\'>Lucida Bright</option>' +
              '<option value=\' Palatino, "Palatino Linotype", "Palatino LT STD", "Book Antiqua", Georgia, serif\'>Palatino</option>' +
              '<option value=\' Perpetua, Baskerville, "Big Caslon", "Palatino Linotype", Palatino, "URW Palladio L", "Nimbus Roman No9 L", serif\'>Perpetua</option>' +
              '<option value=\' Rockwell, "Courier Bold", Courier, Georgia, Times, "Times New Roman", serif\'>Rockwell</option>' +
              '<option value=\' "Rockwell Extra Bold", "Rockwell Bold", monospace\'>Rockwell Extra Bold</option>' +
              '<option value=\' TimesNewRoman, "Times New Roman", Times, Baskerville, Georgia, serif\'>TimesNewRoman</option>' +
              '<option value=\' "Andale Mono", AndaleMono, monospace\'>Andale Mono</option>' +
              '<option value=\' Consolas, monaco, monospace\'>Consolas</option>' +
              '<option value=\' "Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace\'>Courier New</option>' +
              '<option value=\' "Lucida Console", "Lucida Sans Typewriter", Monaco, "Bitstream Vera Sans Mono", monospace\'>Lucida Console</option>' +
              '<option value=\' "Lucida Sans Typewriter", "Lucida Console", Monaco, "Bitstream Vera Sans Mono", monospace\'>Lucida Sans Typewriter</option>' +
              '<option value=\' Monaco, Consolas, "Lucida Console", monospace\'>Monaco</option>' +
              '<option value=\' Copperplate, "Copperplate Gothic Light", fantasy\'>Copperplate</option>' +
              '<option value=\' Papyrus, fantasy\'>Papyrus</option>' +
              '<option value=\' "Brush Script MT", cursive\'>Brush Script MT</option>  ' +
              '</select></label>' +
              '<label class="customz-selectz fontSi">' +
              '<select class="selectThis" data-chg="fontsize">' +
              '<option class="heading" selected>:: Size</option>' +
              '<option value="1">Muito Pequeno</option>' +
              '<option value="2">Pequeno</option>' +
              '<option value="3">Normal</option>' +
              '<option value="4">Médio</option>' +
              '<option value="5">Grande</option>' +
              '<option value="6">Muito Grande</option>' +
              '<option value="7">Maximo</option>' +
              '</select>' +
              '</label>' +
              '<label class="customz-selectz fontCol">' +
              '<select class="selectThis" data-chg="forecolor">' +
              '<option class="heading" selected>:: Fonte</option>' +
              '<option value="#1abc9c" style="background:#1abc9c;">          </option>' +
              '<option value="#16a085" style="background:#16a085;">          </option>' +
              '<option value="#2ecc71" style="background:#2ecc71;">          </option>' +
              '<option value="#27ae60" style="background:#27ae60;">          </option>' +
              '<option value="#3498db" style="background:#3498db;">          </option>' +
              '<option value="#2980b9" style="background:#2980b9;">          </option>' +
              '<option value="#9b59b6" style="background:#9b59b6;">          </option>' +
              '<option value="#8e44ad" style="background:#8e44ad;">          </option>' +
              '<option value="#34495e" style="background:#34495e;">          </option>' +
              '<option value="#2c3e50" style="background:#2c3e50;">          </option>' +
              '<option value="#f1c40f" style="background:#f1c40f;">          </option>' +
              '<option value="#f39c12" style="background:#f39c12;">          </option>' +
              '<option value="#e67e22" style="background:#e67e22;">          </option>' +
              '<option value="#d35400" style="background:#d35400;">          </option>' +
              '<option value="#e74c3c" style="background:#e74c3c;">          </option>' +
              '<option value="#c0392b" style="background:#c0392b;">          </option>' +
              '<option value="#ecf0f1" style="background:#ecf0f1;">          </option>' +
              '<option value="#bdc3c7" style="background:#bdc3c7;">          </option>' +
              '<option value="#95a5a6" style="background:#95a5a6;">          </option>' +
              '<option value="#7f8c8d" style="background:#7f8c8d;">          </option>' +
              '</select>' +
              '</label>' +
              '<label class="customz-selectz fontBck">' +
              '<select class="selectThis" data-chg="backcolor">' +
              '<option class="heading" selected>:: Fundo </option>' +
              '<option value="#1abc9c" style="background:#1abc9c;">          </option>' +
              '<option value="#16a085" style="background:#16a085;">          </option>' +
              '<option value="#2ecc71" style="background:#2ecc71;">          </option>' +
              '<option value="#27ae60" style="background:#27ae60;">          </option>' +
              '<option value="#3498db" style="background:#3498db;">          </option>' +
              '<option value="#2980b9" style="background:#2980b9;">          </option>' +
              '<option value="#9b59b6" style="background:#9b59b6;">          </option>' +
              '<option value="#8e44ad" style="background:#8e44ad;">          </option>' +
              '<option value="#34495e" style="background:#34495e;">          </option>' +
              '<option value="#2c3e50" style="background:#2c3e50;">          </option>' +
              '<option value="#f1c40f" style="background:#f1c40f;">          </option>' +
              '<option value="#f39c12" style="background:#f39c12;">          </option>' +
              '<option value="#e67e22" style="background:#e67e22;">          </option>' +
              '<option value="#d35400" style="background:#d35400;">          </option>' +
              '<option value="#e74c3c" style="background:#e74c3c;">          </option>' +
              '<option value="#c0392b" style="background:#c0392b;">          </option>' +
              '<option value="#ecf0f1" style="background:#ecf0f1;">          </option>' +
              '<option value="#bdc3c7" style="background:#bdc3c7;">          </option>' +
              '<option value="#95a5a6" style="background:#95a5a6;">          </option>' +
              '<option value="#7f8c8d" style="background:#7f8c8d;">          </option>' +
              '</select>' +
              '</label>' +
              '<input type="checkbox" name="switchMode" id="switchBox"/>' +
              '<label for="switchBox" class="intLink"><i class="icon-code"></i></label>' +
              '<a href="javascript:void(0);" class="intLink" title="Print" id="getPrint">' +
              '<i class="icon-print"></i></a>' +
              '<a href="javascript:void(0);" class="intLink" title="Hyperlink" id="getLink" data-fn="createlink">' +
              '<i class="icon-link"></i></a>' +
              '<a href="javascript:void(0);" class="intLink formatBlock" title="Bold"  data-fn="bold">' +
              '<i class="icon-bold"></i></a>' +
              '<a href="javascript:void(0);" class="intLink formatBlock" title="Italic"  data-fn="italic">' +
              '<i class="icon-italic"></i></a>' +
              '<a href="javascript:void(0);" class="intLink formatBlock" title="Underline"  data-fn="underline">' +
              '<i class="icon-underline"></i></a>' +
              '<a href="javascript:void(0);" class="intLink formatBlock" title="Alinhar a esquerda"  data-fn="justifyleft">' +
              '<i class="icon-align-left"></i></a>' +
              '<a href="javascript:void(0);" class="intLink formatBlock" title="Alinhar ao centro"  data-fn="justifycenter">' +
              '<i class="icon-align-center"></i>' + '</a>' +
              '<a href="javascript:void(0);" class="intLink formatBlock" title="Alinhar a direita"  data-fn="justifyright">' +
              '<i class="icon-align-right">' + '</i></a>' +
              '<a href="javascript:void(0);" class="intLink formatBlock" title="Lista numerada"  data-fn="insertorderedList">' +
              '<i class="icon-list-ol"></i></a>' +
              '<a href="javascript:void(0);" class="intLink formatBlock" title="Lista"  data-fn="insertunorderedList">' +
              '<i class="icon-list-ul"></i></a>' +
              '<a href="javascript:void(0);" class="intLink formatBlock" title="Add indentação"  data-fn="indent">' +
              '<i class="icon-indent-right"></i></a>' +
              '<a href="javascript:void(0);" class="intLink formatBlock" title="Delete indentação"  data-fn="outdent">' +
              '<i class="icon-indent-left"></i></a>' +
              '<a href="javascript:void(0);" class="intLink formatBlock" title="HR"  data-fn="inserthorizontalrule">' +
              'HR </a>' +
              ' <a href="javascript:void(0);" class="intLink" title="Add imagem no final" id="getImg" data-fn="insertImage">' +
              '<i class="icon-picture">' + '</i></a>' +
              ' </div>' +
              '<div id="textBox" contenteditable="true">' +
              '</div></div></div>';
          // render html
          el.innerHTML = html;
        }
        
        function initDoc(fm, bx) {
          var elem = bx,
              sDefTxt;
          sDefTxt = bx.innerHTML;
          if (fm.checked) {
            setDocMode(true);
          }
        }
        
        function formatDoc(obj, val) {
          if (validateMode()) {
            document.execCommand(obj, false, val);
          }
        }
        
        
        function validateMode() {
          var thisForm = document.querySelector('#thisForm');
          if (!thisForm.checked) {
            return true;
          }
          alert("Uncheck \"Show HTML\".");
          return false;
        }
        
        function setDocMode(source, oDoc) {
          var sDefTxt = oDoc.innerHTML;
          var oContent;
          if (source) {
            oContent = document.createTextNode(sDefTxt);
            oDoc.innerHTML = "";
            var oPre = document.createElement("pre");
            oDoc.contentEditable = false;
            oPre.id = "sourceText";
            oPre.contentEditable = true;
            oPre.appendChild(oContent);
            oDoc.appendChild(oPre);
          } else {
            if (document.all) {
              sDefTxt = oDoc.innerText;
            } else {
              oContent = document.createRange();
              oContent.selectNodeContents(oDoc.firstChild);
              oDoc.innerHTML = oContent.toString();
            }
            oDoc.contentEditable = true;
          }
        }
        
        
        // print function 
        
        function printDoc(el) {
          if (!validateMode()) {
            return;
          }
          var oPrntWin = window.open("", "_blank", "width=450,height=470,left=400,top=100,menubar=yes,toolbar=no,location=no,scrollbars=yes");
          oPrntWin.document.open();
          oPrntWin.document.write('<!doctype html><html><head><title>Print<\/title><\/head><body onload=\"print();\">' + el + '<\/body><\/html>');
          oPrntWin.document.close();
        }
        
        
        // extend options
        
        function extend(a, b) {
          for (var key in b) {
            if (b.hasOwnProperty(key)) {
              a[key] = b[key];
            }
          }
          return a;
        }
        
        function sweDitor(elem, options) {
          // The div of editor
          this.elem = elem;
          // The options  ex. this.options.type = hello
          this.options = extend(this.defaults, options);
          // Get Template
          getTemplate(elem);
          // Start init
          this._init();
        }
        
        sweDitor.prototype = {
          // this.options.type
          defaults: {
            textArea: 'editor_area',
            showTextarea: true
          },
          
          // this._init();
          _init: function() {
            var self = this;
            globalSelf = this;
            // Div of content
            this.box = document.querySelector('#textBox');
            // array for change event
            this.selects = Array.prototype.slice.call(this.elem.querySelectorAll('.selectThis'));
            // array for click event
            this.formats = Array.prototype.slice.call(this.elem.querySelectorAll('.formatBlock'));
            // get print id
            this.getPrint = document.getElementById('getPrint');
            // The textarea
            this.textArea = document.getElementById(this.options.textArea);
            // get link id
            this.getLink = document.getElementById('getLink');
            // get img id 
            this.getImg = document.getElementById('getImg');
            // get switchbox
            this.switchBox = document.getElementById('switchBox');
            // Init Doc function
            initDoc(this, this.textArea);
            this._initEvents();
          },
          
          // this._initEvents();
          _initEvents: function() {
            
            var self = this;
            
            //Show or hide textarea
            if (this.options.showTextarea === true) {
              self.textArea.style.display = 'block';
            } else {
              self.textArea.style.display = 'none';
            }
            
            // On ready copy text of text area
            this.box.innerHTML = this.textArea.textContent;
            // On keyup copy text on textarea
            this.box.addEventListener('keyup', function() {
              self.textArea.textContent = self.box.innerHTML;
            }, false);
            // On keydown copy text on textarea
            this.box.addEventListener('keydown', function() {
              self.textArea.textContent = self.box.innerHTML;
            }, false);
            // On mouseover copy text on textarea
            this.box.addEventListener('mouseover', function() {
              self.textArea.textContent = self.box.innerHTML;
            }, false);
            // On mouseleave copy text on textarea
            this.box.addEventListener('mouseleave', function() {
              self.textArea.textContent = self.box.innerHTML;
            }, false);
            // add event on change for  all selects 
            this.selects.forEach(function(el, i) {
              el.addEventListener('change', function() {
                formatDoc(this.getAttribute('data-chg'), this.value);
                self.textArea.textContent = self.box.innerHTML;
              }, false);
            });
            // get print
            this.getPrint.addEventListener('click', function() {
              printDoc(self.textArea.textContent);
              self.textArea.textContent = self.box.innerHTML;
            }, false);
            // link listener
            this.getLink.addEventListener('click', function() {
              var sLnk = prompt('Digite a URL aqui', 'http:\/\/');
              if (sLnk && sLnk !== '' && sLnk !== 'http://') {
                formatDoc(this.getAttribute('data-fn'), sLnk);
                console.log(this.getAttribute('data-fn') + "teste -------------")
                this.getAttribute('data-fn').setAttribute("target", "_blank");
                self.textArea.textContent = self.box.innerHTML;
              }
            }, false);
            // img listener
            this.getImg.addEventListener('click', function() {
              // var simg = prompt('Write the URL of image here', 'http:\/\/');
              // if (simg && simg !== '') {
              //   formatDoc(this.getAttribute('data-fn'), simg);
              //   self.textArea.textContent = self.box.innerHTML;
              // }

              selCaret = window.getSelection();
              if (selCaret.getRangeAt && selCaret.rangeCount) {
                  rangeCaret = selCaret.getRangeAt(0);
                  rangeCaret.deleteContents();
              }
              $("#prompt").show("closed");
              document.getElementById("promptInput").focus();
            }, false);
            
            // all other formats  
            this.formats.forEach(function(el, i) {
              el.addEventListener('click', function() {
                formatDoc(this.getAttribute('data-fn'));
                self.textArea.textContent = self.box.innerHTML;
              }, false);
            });
            // swich pre code
            this.switchBox.addEventListener('change', function() {
              setDocMode(this.checked, self.box);
              self.textArea.textContent = self.box.innerHTML;
            }, false);
          }
          
        };
        
        // add to global namespace
        window.sweDitor = sweDitor;
        
      })(window);
      
      // Init editor
      new sweDitor(document.getElementById('editor_panel'),{
        textArea: 'editor_area', //id of textarea
        showTextarea: false // if true show hidden text area
      });