import React from 'react';
import Table from './Table';
import 'react-medium-image-zoom/dist/styles.css';

const ImageResult = [
  {
    image_type: 'XRAY',
    result_image: 'https://i.imgur.com/Ci2wzcv.jpg',
    comparison: 'None',
    indication: 'Burmese male',
    findings: 'Both lungs are clear',
    impresssions: 'No active disease',
    date_of_examindation: '23 Aug 2023'
  }
];

function ImagingResult({ slug }) {
  return (
    <div>
      <Table
        title="Patient List"
        action={false}
        slug={slug}
        tableHeader={Object.keys(ImageResult[0])}
        tableData={ImageResult}
      />
    </div>
  );
}

export default ImagingResult;
