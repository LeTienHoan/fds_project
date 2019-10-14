export default {
  data () {
    return {
      customFilterUser (item, queryText, itemText) {
        const hasValue = val => val != null ? val : ''
        let text = hasValue(item.fullName)
        text = text + hasValue(item.email)
        const query = hasValue(queryText)
        return text.toString()
          .toLowerCase()
          .indexOf(query.toString().toLowerCase()) > -1
      }
    }
  }
}
