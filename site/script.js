jQuery.fn.selectText = function(){
    this.find('input').each(function() {
        if($(this).prev().length == 0 || !$(this).prev().hasClass('p_copy')) { 
            $('<p class="p_copy" style="position: absolute; z-index: -1;"></p>').insertBefore($(this));
        }
        $(this).prev().html($(this).val());
    });
    var doc = document;
    var element = this[0];
    if (doc.body.createTextRange) {
        var range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        var selection = window.getSelection();        
        var range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }
};

$(function() {
    this.menu = $("#nav-menu");
    this.menuItemTemplate = `<a class="dropdown-item"></a>`;
    this.content = $("#content");
    this.categoryTemplate = `<h2 class="pt-3"></h2>`;
    this.snippetTemplate = `
    <div class="snippet mt-2">
        <hr>
        <div data-role="pin">
            <div class="output mt-2 p-1 border"></div>
        </div>
        <div class="actions text-right mt-2 clearfix">
            <button name="copyHtml" data-show="true" class="btn btn-sm btn-secondary">Copy HTML</button>
            <button name="copyJs" data-show="true" class="btn btn-sm btn-secondary">Copy JS</button>
            <button name="show" data-show="true" class="btn btn-sm btn-primary">Show</button>
            <label class="d-block float-left"><input type="checkbox" name="ignoreRTL">&nbsp;&nbsp;Ignore RTL</label>
        </div>
        <bdo dir="ltr" style="text-align: left">
            <div class="code-container d-none mt-2">
            <input name="test">
                <pre class="code html border p-3 mb-0 w-100"></pre>
                <pre class="code js border p-3 mb-0 border-top-0 w-100"></pre>
            </div>
        </bdo>
    </div>
    `;
    this.processData = function(snippets) {
        for (let i = 0; i < snippets.length; i++) {
            let s = snippets[i];
            this.content.append(
                $(this.categoryTemplate).text(s.category).attr("id", i+1).toggleClass("mt-5", i > 0)
            );
            this.menu.append(
                $(this.menuItemTemplate).attr("href", "#" + (i+1)).text(s.category)
            );

            for (let c of s.content) {
                let snippetElement = $(this.snippetTemplate);
                let showBtn = snippetElement.find("button[name=show]");
                let copyHtmlBtn = snippetElement.find("button[name=copyHtml]");
                let copyJsBtn = snippetElement.find("button[name=copyJs]");
                let output = snippetElement.find(".output");
                let codeContainer = snippetElement.find(".code-container");
                let codeHtml = snippetElement.find(".code.html");
                let codeJs = snippetElement.find(".code.js");

                output.html(c.html);
                codeHtml.text(c.html);
                if (c.js) {
                    codeJs.text(c.js);
                } else {
                    codeJs.remove();
                }
                this.content.append(snippetElement);
                
                showBtn.on("click", function() {
                    let shown = !codeContainer.hasClass("d-none");
                    if (shown) { // Hide if shown
                        codeContainer.slideUp(200, function() {
                            codeContainer.addClass("d-none");
                        });
                        showBtn.text("Show");
                    } else {
                        codeContainer.removeClass("d-none");
                        codeContainer.slideUp(0); // 
                        codeContainer.slideDown(200);
                        showBtn.text("Hide");
                    }
                });

                copyHtmlBtn.on("click", function() {
                    codeHtml.selectText();
                    document.execCommand('copy');
                });

                copyJsBtn.on("click", function() {
                    codeJs.selectText();
                    document.execCommand('copy');
                });
                
                ignoreRTLCb.on("change", function() {
                    pinContainer.toggleClass("nortl", this.checked);
                });
            }
        }
    };

    $.ajax({
        method: "GET",
        url: "snippets.json",
        dataType: "json",
        context: this
    }).done(this.processData);

    $("#rtlSwitch").on("click", function() {
        let html = $("html");
        html.attr("dir", html.attr("dir") === 'rtl' ? 'ltr' : 'rtl');
    });

});