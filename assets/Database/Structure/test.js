()=>{
    var year = INT(YEAR('[ថ្ងៃខែឆ្នាំកំណើត]')) + 60;
    return DAY('[ថ្ងៃខែឆ្នាំកំណើត]') + ' ថ្ងៃ ' + MONTH('[ថ្ងៃខែឆ្នាំកំណើត]') + ' ខែ ' + year + ' ឆ្នាំ';
}