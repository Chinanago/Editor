window.onload = async () => {
    await markdown.ready;
    const input = document.getElementById("input");
    const output = document.getElementById("output");
    const save_btn = document.getElementById('save');
    const load_btn = document.getElementById('load');
    const delete_btn = document.getElementById('delete');
    const load_selection = document.getElementById('load_selection');
    const download_btn = document.getElementById('download');

    inputChange = () => {
        var Katex_md = input.value
                        .replace(/\$\$[\s\S]*?\$\$/g, function(match){
                          var ret = match.slice(2,-2).trim();
                          return katex.renderToString(ret, {
                            displayMode: true,
                            throwOnError: false
                          });
                        })
                        .replace(/\$[\s\S]*?\$/g, function(match){
                          var ret = match.slice(1,-1).trim();
                          return katex.renderToString(ret, {
                            throwOnError: false
                          });
                        });
        output.innerHTML = markdown.parse(Katex_md);
      };
      
    inputChange();
    input.addEventListener('input', inputChange);

    export_pdf.onclick = () => {
      const content = output; 
      const option = {
        margin: 1, // 余白
        filename: 'test1.pdf', // ファイル名
        image: { type: 'png', quality: 1 }, // PDFの生成に使用される画像のタイプとクオリティ
        html2canvas: { scale: 2, useCORS: true }, // html2canvasで使用される設定を記述。useCORS: trueを設定すると別ドメインの画像を表示できる（サイトによってはできないこともある）
        jsPDF: { format: 'a2', orientation: 'portrait' }, // jsPDFで使用される設定を記述
      };

      html2pdf()
          .from(content)
          .set(option)
          .save()
          .then(() => {
              // 成功
          })
          .catch((e) => {
              console.error(e);
          });
      }

    download_btn.onclick = () => {
      const apiHTML = document.head.innerHTML;
      var content = output.innerHTML;
      var blob = new Blob([apiHTML + content], {"type" : "text/plain"});
      if (window.navigator.msSaveBlob) { 
        window.navigator.msSaveBlob(blob, "test.html"); 
        // msSaveOrOpenBlobの場合はファイルを保存せずに開ける
        window.navigator.msSaveOrOpenBlob(blob, "test.html"); 
      } else {
        download_btn.href = window.URL.createObjectURL(blob);
      }
    }
}