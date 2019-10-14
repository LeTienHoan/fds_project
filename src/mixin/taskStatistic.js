const MobilinkVariablesConstants =
{
  methods: {
    printTaskStatistic: function (options, data) {
      let bodyRender = ''
      for (let key in data) {
        let stt = Number(key) + 1
        bodyRender += '' +
          '   <tr class="layout wrap" >                           ' +
          '     <td class="text-align-center">' + stt + '</td> ' +
          '     <td class="text-align-left">' + data[key].name + '</td>                ' +
          '     <td class="text-align-right">' + data[key].tong_so + '</td>                ' +
          '     <td class="text-align-right">' + data[key].tao_moi + '</td>                ' +
          '     <td class="text-align-right">' + data[key].ton_truoc + '</td>              ' +
          '     <td class="text-align-right">' + data[key].chua_thuc_hien + '</td>         ' +
          '     <td class="text-align-right">' + data[key].dang_thuc_hien_tong_so + '</td> ' +
          '     <td class="text-align-right">' + data[key].dang_thuc_hien_con_han + '</td> ' +
          '     <td class="text-align-right">' + data[key].dang_thuc_hien_tre_han + '</td> ' +
          '     <td class="text-align-right">' + data[key].da_hoan_thanh_tong_so + '</td>  ' +
          '     <td class="text-align-right">' + data[key].da_hoan_thanh_dung_han + '</td> ' +
          '     <td class="text-align-right">' + data[key].da_hoan_thanh_qua_han + '</td>  ' +
          '     <td class="text-align-right">' + data[key].da_hoan_thanh_diem_danh_gia_tb +
          '     </td>                                                                   ' +
          '     <td class="text-align-right grey--text">' + data[key].da_hoan_thanh_ty_le_qua_han +
          '     </td>                                                                   ' +
          '  </tr>                                               '
      }
      let tableRender = '' +
        '<table>                                                   ' +
        '  <thead>                                                 ' +
        '    <tr>                                                  ' +
        '      <th rowspan="2">' + options.labels.stt + '</th>                            ' +
        '      <th rowspan="2">' + options.labels.name + '</th>                           ' +
        '      <th rowspan="2">' + options.labels.tong_so + '</th>                        ' +
        '      <th rowspan="2">' + options.labels.tao_moi + '</th>                        ' +
        '      <th rowspan="2">' + options.labels.ton_truoc + '</th>                      ' +
        '      <th class="color-chua-thuc-hien" rowspan="2"> ' + options.labels.chua_thuc_hien +
        '      </th>                                                                      ' +
        '      <th class="color-dang-thuc-hien" colspan="3"> ' + options.labels.dang_thuc_hien +
        '      </th>                                                                      ' +
        '      <th class="color-da-hoan-thanh" colspan="5"> ' + options.labels.da_hoan_thanh +
        '      </th>                                                                      ' +
        '    </tr>                                                 ' +
        '    <tr>                                                  ' +
        '      <th> ' + options.labels.dang_thuc_hien_tong_so + '</th>  ' +
        '      <th> ' + options.labels.dang_thuc_hien_con_han + '</th>  ' +
        '      <th> ' + options.labels.dang_thuc_hien_tre_han + '</th>  ' +
        '      <th> ' + options.labels.da_hoan_thanh_tong_so + '</th>  ' +
        '      <th> ' + options.labels.da_hoan_thanh_dung_han + '</th>  ' +
        '      <th> ' + options.labels.da_hoan_thanh_qua_han + '</th>  ' +
        '      <th> ' + options.labels.da_hoan_thanh_diem_danh_gia_tb + '</th>  ' +
        '      <th> ' + options.labels.da_hoan_thanh_ty_le_qua_han + '</th>  ' +
        '    </tr>  ' +
        '  </thead>                                                 ' +
        '  <tbody>                                                  ' +
        bodyRender +
        '  </tbody>                                                 ' +
        '</table>                                                   '
      let headerRender = '' +
        '<h3>' + options.labels.title + '</h3>' +
        '<div class="text-align-center">' + options.monthAndYear + '</div>'
      let footerRender = '' +
        '<div class="footTable">' +
        ' <i>--' + options.labels.end + '--</i>' +
        '</div>'
      let linkFont = ''
      let style = '' +
        '<style>' +
        ' @media print {' +
        ' table { font-family: "Roboto", sans-serif; }' +
        ' tr { font-family: "Roboto", sans-serif; }' +
        ' th { font-family: "Roboto", sans-serif; }' +
        ' td { font-family: "Roboto", sans-serif; }' +
        ' div { font-family: "Roboto", sans-serif; }' +
        ' h3 {text-align: center;}' +
        ' .footTable {text-align: center; color: grey; padding: 10px;}' +
        ' table {width:100%; border-collapse: collapse; border-spacing: 0; margin: 20px;}' +
        ' td {border: lightgrey 1px solid; padding: 0.5em 0.5em;}' +
        ' th {border: lightgrey 1px solid; padding: .1em 0.2em;}' +
        ' .text-align-center {text-align: center;}' +
        ' .text-align-left {text-align: left;}' +
        ' .text-align-right {text-align: right;}' +
        ' .color-chua-thuc-hien {color: #ffc107;}' +
        ' .color-dang-thuc-hien {color: #00bcd4;}' +
        ' .color-da-hoan-thanh {color: #8bc34a;}' +
        ' .grey--text {color: grey;}' +
        ' }' +
        '</style>'
      let printContents = linkFont + headerRender + tableRender + footerRender + style
      let w = window.open()
      w.document.write(printContents)
      w.print()
      w.close()
    }
  }
}

export default MobilinkVariablesConstants
