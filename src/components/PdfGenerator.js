import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useGeneratePdfQuery } from '@/service/pdfService';
import { usePdfContext } from '@/utils/context';
import { PDFDocument, StandardFonts, fontkit } from 'pdf-lib';
import { rgb } from 'node_modules/pdf-lib/cjs/index';
import {
  useGetCityDataQuery,
  useGetProvinceDataQuery,
  useGetSpecificBarangayDataQuery
} from '@/service/psgcService';
import { useGetAboutUsInfoQuery } from '@/service/settingService';

const PdfGenerator = forwardRef(({ category }, ref) => {
  const [pdfLink, setPdfLink] = useState(null);
  const context = usePdfContext();
  const { data: aboutUsData } = useGetAboutUsInfoQuery();
  const { data: provinceData } = useGetProvinceDataQuery();
  const { data: cityData } = useGetCityDataQuery({
    provinceCode: context?.data.profileData.user_data_info?.province
  });
  const { data: barangayData } = useGetSpecificBarangayDataQuery({
    provinceCode: context?.data.profileData.user_data_info?.province
  });
  const cr_heent = context?.data.profileData?.cr_heent?.split(',') || [];
  const cr_chest_lungs =
    context?.data.profileData?.cr_chest_lungs?.split(',') || [];
  const cr_cvs = context?.data.profileData?.cr_cvs?.split(',') || [];
  const cr_neurological_exam =
    context?.data.profileData?.cr_neurological_exam?.split(',') || [];

  console.log(aboutUsData)

  const {
    data: pdfBlob,
    isLoading,
    isError,
    error,
    isSuccess
  } = useGeneratePdfQuery(
    {
      pdfCategory: pdfLink
    },
    { enabled: !!pdfLink }
  );

  useEffect(() => {
    setPdfLink(category);
  }, [category]);

  useImperativeHandle(context?.ref, () => ({
    handleGeneratePDF: (data) => handleGeneratePDF(data)
  }));

  const blobToArrayBuffer = async (blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });

  // const formatAMPM = (date) => {
  //     const hours = date.getHours()
  //     const minutes = date.getMinutes()
  //     const ampm = hours >= 12 ? 'pm' : 'am'
  //     hours = hours % 12
  //     hours = hours ? hours : 12 // the hour '0' should be '12'
  //     minutes = minutes < 10 ? '0'+minutes : minutes
  //     const strTime = hours + ':' + minutes + ' ' + ampm
  //     return strTime
  // }

  const handleGeneratePDF = async (data) => {
    // setPdfLink(data.type)
    console.log(context.data.profileData.user_data_info);
    console.log(context.data.profileData);
    const pdfArrayBuffer = await blobToArrayBuffer(pdfBlob);
    const pdfDoc = await PDFDocument.load(pdfArrayBuffer);
    const courierFont = await pdfDoc.embedFont(StandardFonts.Courier);

    const page = pdfDoc.getPages();
    const firstPage = page[0];
    const secondPage = page[1];
    const { height } = firstPage.getSize();
    const heent = cr_heent.map((item) => item.replace(/^"|"$/g, ''));
    const chest_lungs = cr_chest_lungs.map((item) =>
      item.replace(/^"|"$/g, '')
    );
    const cvs = cr_cvs.map((item) => item.replace(/^"|"$/g, ''));
    const neurological_exam = cr_neurological_exam.map((item) =>
      item.replace(/^"|"$/g, '')
    );
    const admissionDate = new Date(context?.data.profileData.admission_date);
    const formattedDateTime = admissionDate.toLocaleString('en-US', {
      month: '2-digit',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit', // 12-hour format
      minute: '2-digit',
      hour12: false // Ensures AM/PM is included
    });
    const [formattedAdmissionDate, formattedAdmissionTime] =
      formattedDateTime.split(' ');
    const [hour, minute] = formattedAdmissionTime.split(':');
    const [mm, dd, yyyy] = formattedAdmissionDate.split('/');
    const timePeriod = hour >= 12 ? 'PM' : 'AM';

    function removeNonAnsiChars(text) {
      return text.replace(/[^\x20-\x7E]/g, ''); // Filter out non-ANSI
    }

    function drawWrappedText(text, maxWidth, font, fontSize) {
      const words = text.split(' ');
      const lines = [];
      let currentLine = '';

      for (const word of words) {
        const potentialLine = `${currentLine} ${word}`;
        const filteredLine = removeNonAnsiChars(potentialLine);
        const width = font.widthOfTextAtSize(filteredLine, fontSize);

        if (width > maxWidth) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = potentialLine;
        }
      }

      // Add the last line
      if (currentLine) {
        lines.push(currentLine);
      }

      return lines;
    }

    function decodeProvince(provinceCode) {
      const response = provinceData?.find(
        (province) => province.code == provinceCode ?? ''
      );
      return response?.name.toUpperCase() ?? '';
    }

    function decodeCity(cityCode) {
      const response = cityData?.find((city) => city.code == cityCode ?? '');
      return response?.name.toUpperCase() ?? '';
    }

    function decodeBarangay(brgyCode) {
      const response = barangayData?.find(
        (brgy) => brgy.code == brgyCode ?? ''
      );
      return response?.name.toUpperCase() ?? '';
    }

    switch (data.type) {
      case 'print-phealth-cf1':
        firstPage.drawText(
          context?.data.profileData.user_data_info?.last_name.toUpperCase(),
          {
            x:
              25 +
              (120 -
                20 -
                courierFont.widthOfTextAtSize(
                  context?.data.profileData.user_data_info?.last_name,
                  12
                )) /
                2,
            y: height - 253,
            size: 12,
            font: courierFont
          }
        );

        firstPage.drawText(
          context?.data.profileData.user_data_info?.first_name.toUpperCase(),
          {
            x:
              135 +
              (230 -
                130 -
                courierFont.widthOfTextAtSize(
                  context?.data.profileData.user_data_info?.first_name,
                  12
                )) /
                2,
            y: height - 253,
            size: 12,
            font: courierFont
          }
        );

        firstPage.drawText(
          context?.data.profileData.user_data_info?.suffix?.toUpperCase() ?? '',
          {
            x:
              250 +
              (338 -
                245 -
                courierFont.widthOfTextAtSize(
                  context?.data.profileData.user_data_info?.suffix ?? '',
                  12
                )) /
                2,
            y: height - 253,
            size: 12,
            font: courierFont
          }
        );

        firstPage.drawText(
          context?.data.profileData.user_data_info?.middle_name.toUpperCase(),
          {
            x:
              355 +
              (430 -
                350 -
                courierFont.widthOfTextAtSize(
                  context?.data.profileData.user_data_info?.middle_name,
                  12
                )) /
                2,
            y: height - 253,
            size: 12,
            font: courierFont
          }
        );

        firstPage.drawText(
          context?.data.profileData.user_data_info?.last_name.toUpperCase(),
          {
            // x: 40,
            // y: height - 250,
            x:
              25 +
              (120 -
                20 -
                courierFont.widthOfTextAtSize(
                  context?.data.profileData.user_data_info?.last_name,
                  12
                )) /
                2,
            y: height - 485,
            size: 12,
            font: courierFont
          }
        );

        firstPage.drawText(
          context?.data.profileData.user_data_info?.first_name.toUpperCase(),
          {
            // x: 155,
            // y: height - 250,
            // 130 - 230
            x:
              135 +
              (230 -
                130 -
                courierFont.widthOfTextAtSize(
                  context?.data.profileData.user_data_info?.first_name,
                  12
                )) /
                2,
            y: height - 485,
            size: 12,
            font: courierFont
          }
        );

        firstPage.drawText(
          context?.data.profileData.user_data_info?.suffix?.toUpperCase() ?? '',
          {
            x:
              250 +
              (338 -
                245 -
                courierFont.widthOfTextAtSize(
                  context?.data.profileData.user_data_info?.suffix ?? '',
                  12
                )) /
                2,
            y: height - 485,
            size: 12,
            font: courierFont
          }
        );

        firstPage.drawText(
          context?.data.profileData.user_data_info?.middle_name.toUpperCase(),
          {
            // x: 370,
            // y: height - 250,
            // 350 - 430
            x:
              355 +
              (430 -
                350 -
                courierFont.widthOfTextAtSize(
                  context?.data.profileData.user_data_info?.middle_name,
                  12
                )) /
                2,
            y: height - 485,
            size: 12,
            font: courierFont
          }
        );

        const bday = context?.data.profileData.user_data_info?.birth_date;
        const parts = bday.split('-');
        const parts1 = parts[1].split('');
        const parts2 = parts[2].split('');
        const parts0 = parts[0].split('');
        let xAxisBdayMonth = 460;
        let xAxisBdayDay = 492;
        let xAxisBdayYear = 524;
        for (let i = 0; i < parts1.length; i++) {
          firstPage.drawText(parts1[i], {
            // x: 463,
            // y: height - 250,
            x: xAxisBdayMonth,
            y: height - 485,
            size: 13,
            font: courierFont
          });

          firstPage.drawText(parts1[i], {
            x: xAxisBdayMonth,
            y: height - 253,
            size: 13,
            font: courierFont
          });

          xAxisBdayMonth += 12;
        }
        for (let i = 0; i < parts2.length; i++) {
          firstPage.drawText(parts2[i], {
            // x: 463,
            // y: height - 250,
            x: xAxisBdayDay,
            y: height - 485,
            size: 13,
            font: courierFont
          });

          firstPage.drawText(parts2[i], {
            x: xAxisBdayDay,
            y: height - 253,
            size: 13,
            font: courierFont
          });

          xAxisBdayDay += 12;
        }
        for (let i = 0; i < parts0.length; i++) {
          firstPage.drawText(parts0[i], {
            // x: 463,
            // y: height - 250,
            x: xAxisBdayYear,
            y: height - 485,
            size: 13,
            font: courierFont
          });

          firstPage.drawText(parts0[i], {
            x: xAxisBdayYear,
            y: height - 253,
            size: 13,
            font: courierFont
          });

          xAxisBdayYear += 12;
        }

        context?.data.profileData.user_data_info?.gender === 'male'
          ? (firstPage.drawRectangle({
              x: 483,
              y: height - 295.5,
              width: 12,
              height: 12,
              color: rgb(0, 0, 0)
            }),
            firstPage.drawRectangle({
              x: 483,
              y: height - 524,
              width: 12,
              height: 12,
              color: rgb(0, 0, 0)
            }))
          : (firstPage.drawRectangle({
              x: 519,
              y: height - 295.5,
              width: 12,
              height: 12,
              color: rgb(0, 0, 0)
            }),
            firstPage.drawRectangle({
              x: 519,
              y: height - 524,
              width: 12,
              height: 12,
              color: rgb(0, 0, 0)
            }));

        firstPage.drawText(
          context?.data.profileData.user_data_info?.no_blk_lot?.toUpperCase() ??
            '',
          {
            x:
              250 +
              (338 -
                245 -
                courierFont.widthOfTextAtSize(
                  context?.data.profileData.user_data_info?.no_blk_lot ?? '',
                  12
                )) /
                2,
            y: height - 310,
            size: 12,
            font: courierFont
          }
        );

        firstPage.drawText(
          context?.data.profileData.user_data_info?.street?.toUpperCase() ?? '',
          {
            x:
              360 +
              (430 -
                355 -
                courierFont.widthOfTextAtSize(
                  context?.data.profileData.user_data_info?.street ?? '',
                  12
                )) /
                2,
            y: height - 310,
            size: 12,
            font: courierFont
          }
        );

        firstPage.drawText(
          context?.data.profileData.user_data_info?.subdivision_village?.toUpperCase() ??
            '',
          {
            x:
              455 +
              (580 -
                450 -
                courierFont.widthOfTextAtSize(
                  context?.data.profileData.user_data_info
                    ?.subdivision_village ?? '',
                  12
                )) /
                2,
            y: height - 310,
            size: 12,
            font: courierFont
          }
        );

        firstPage.drawText(
          decodeBarangay(context?.data.profileData.user_data_info?.barangay),
          {
            x:
              30 +
              (118 -
                25 -
                courierFont.widthOfTextAtSize(
                  decodeBarangay(
                    context?.data.profileData.user_data_info?.barangay
                  ),
                  12
                )) /
                2,
            y: height - 340,
            size: 12,
            font: courierFont
          }
        );

        firstPage.drawText(
          decodeCity(context?.data.profileData.user_data_info?.city_of),
          {
            x:
              140 +
              (228 -
                135 -
                courierFont.widthOfTextAtSize(
                  decodeCity(context?.data.profileData.user_data_info?.city_of),
                  12
                )) /
                2,
            y: height - 340,
            size: 12,
            font: courierFont
          }
        );

        firstPage.drawText(
          decodeProvince(context?.data.profileData.user_data_info?.province),
          {
            x:
              250 +
              (337 -
                245 -
                courierFont.widthOfTextAtSize(
                  decodeProvince(
                    context?.data.profileData.user_data_info?.province
                  ),
                  12
                )) /
                2,
            y: height - 340,
            size: 12,
            font: courierFont
          }
        );

        firstPage.drawText('Philippines'.toUpperCase(), {
          x:
            360 +
            (430 - 355 - courierFont.widthOfTextAtSize('Philippines', 12)) / 2,
          y: height - 340,
          size: 12,
          font: courierFont
        });

        firstPage.drawText(
          context?.data.profileData.user_data_info?.zip_code ?? '',
          {
            x:
              455 +
              (580 -
                450 -
                courierFont.widthOfTextAtSize(
                  context?.data.profileData.user_data_info?.zip_code ?? '',
                  12
                )) /
                2,
            y: height - 340,
            size: 12,
            font: courierFont
          }
        );

        firstPage.drawText(
          context?.data.profileData.user_data_info?.telephone_no ?? '',
          {
            x:
              27 +
              (205 -
                32 -
                courierFont.widthOfTextAtSize(
                  context?.data.profileData.user_data_info?.telephone_no ?? '',
                  12
                )) /
                2,
            y: height - 385,
            size: 12,
            font: courierFont
          }
        );

        firstPage.drawText(
          context?.data.profileData.user_data_info?.contact_no ?? '',
          {
            x:
              227 +
              (377 -
                222 -
                courierFont.widthOfTextAtSize(
                  context?.data.profileData.user_data_info?.contact_no ?? '',
                  12
                )) /
                2,
            y: height - 385,
            size: 12,
            font: courierFont
          }
        );

        firstPage.drawText(
          context?.data.profileData.user_data_info?.email ?? '',
          {
            x:
              400 +
              (580 -
                395 -
                courierFont.widthOfTextAtSize(
                  context?.data.profileData.user_data_info?.email ?? '',
                  12
                )) /
                2,
            y: height - 385,
            size: 12,
            font: courierFont
          }
        );
        break;

      case 'print-phealth-cf2':
        const panCf2 = aboutUsData?.[0]?.accreditation_no.toString() ?? '';
        let xAxisPanCf2 = 332;
        for (let i = 0; i < panCf2.length; i++) {
          firstPage.drawText(panCf2[i], {
            x: xAxisPanCf2,
            y: height - 203,
            size: 13,
            font: courierFont
          });

          xAxisPanCf2 += 12.5;
        }

        firstPage.drawText(aboutUsData?.[0]?.hci_name.toUpperCase() ?? '', {
          x: 180,
          y: height - 219,
          size: 12,
          font: courierFont
        });

        firstPage.drawText(
          `${aboutUsData?.[0]?.building_no.toUpperCase()} ${aboutUsData?.[0]?.blk.toUpperCase()}`,
          {
            x:
              83 +
              (280 -
                78 -
                courierFont.widthOfTextAtSize(
                  (aboutUsData?.[0]?.building_no ?? '') +
                    ' ' +
                    (aboutUsData?.[0]?.blk ?? ''),
                  10
                )) /
                2,
            y: height - 235,
            size: 10,
            font: courierFont
          }
        );

        firstPage.drawText(
          `${aboutUsData?.[0]?.barangay_name.toUpperCase()}/${aboutUsData?.[0]?.city_name.toUpperCase() ?? aboutUsData?.[0]?.municipality_name.toUpperCase()}`,
          {
            x:
              302 +
              (433 -
                297 -
                courierFont.widthOfTextAtSize(
                  (aboutUsData?.[0]?.barangay_name ?? '') +
                    '/' +
                    (aboutUsData?.[0]?.city_name
                      ? aboutUsData?.[0]?.city_name ?? ''
                      : aboutUsData?.[0]?.municipality_name ?? ''),
                  10
                )) /
                2,
            y: height - 235,
            size: 10,
            font: courierFont
          }
        );

        firstPage.drawText(aboutUsData?.[0]?.province_name.toUpperCase() ?? '', {
          x:
            455 +
            (582 -
              450 -
              courierFont.widthOfTextAtSize(
                aboutUsData?.[0]?.province_name ?? '',
                10
              )) /
              2,
          y: height - 235,
          size: 10,
          font: courierFont
        });

        firstPage.drawText(
          context?.data.profileData.user_data_info?.last_name.toUpperCase(),
          {
            // y: height - 250,
            x:
              130 +
              (228 -
                125 -
                courierFont.widthOfTextAtSize(
                  context?.data.profileData.user_data_info?.last_name,
                  12
                )) /
                2,
            y: height - 282,
            size: 12,
            font: courierFont
          }
        );

        firstPage.drawText(
          context?.data.profileData.user_data_info?.first_name.toUpperCase(),
          {
            // y: height - 250,
            x:
              250 +
              (360 -
                245 -
                courierFont.widthOfTextAtSize(
                  context?.data.profileData.user_data_info?.first_name,
                  12
                )) /
                2,
            y: height - 282,
            size: 12,
            font: courierFont
          }
        );

        firstPage.drawText(
          context?.data.profileData.user_data_info?.suffix?.toUpperCase() ?? '',
          {
            x:
              380 +
              (445 -
                375 -
                courierFont.widthOfTextAtSize(
                  context?.data.profileData.user_data_info?.suffix ?? '',
                  12
                )) /
                2,
            y: height - 282,
            size: 12,
            font: courierFont
          }
        );

        firstPage.drawText(
          context?.data.profileData.user_data_info?.middle_name.toUpperCase(),
          {
            // y: height - 250,
            x:
              475 +
              (583 -
                470 -
                courierFont.widthOfTextAtSize(
                  context?.data.profileData.user_data_info?.middle_name,
                  12
                )) /
                2,
            y: height - 282,
            size: 12,
            font: courierFont
          }
        );

        let xAxisTimeAdmittedHour = 395;
        let xAxisTimeAdmittedMinute = 426;
        firstPage.drawText(`${mm.split('').join(' ') ?? ''}`, {
          x: 201,
          y: height - 368,
          size: 10,
          font: courierFont
        });
        firstPage.drawText(`${dd.split('').join(' ') ?? ''}`, {
          x: 233,
          y: height - 368,
          size: 10,
          font: courierFont
        });
        firstPage.drawText(`${yyyy.split('').join(' ') ?? ''}`, {
          x: 265,
          y: height - 368,
          size: 10,
          font: courierFont
        });
        for (let i = 0; i < hour.length; i++) {
          firstPage.drawText(hour[i], {
            x: xAxisTimeAdmittedHour,
            y: height - 368,
            size: 10,
            font: courierFont
          });
          xAxisTimeAdmittedHour += 12;
        }
        for (let i = 0; i < minute.length; i++) {
          firstPage.drawText(minute[i], {
            x: xAxisTimeAdmittedMinute,
            y: height - 368,
            size: 10,
            font: courierFont
          });
          xAxisTimeAdmittedMinute += 12;
        }
        timePeriod === 'AM'
          ? firstPage.drawRectangle({
              x: 471,
              y: height - 372,
              width: 12,
              height: 12,
              color: rgb(0, 0, 0)
            })
          : firstPage.drawRectangle({
              x: 513,
              y: height - 372,
              width: 12,
              height: 12,
              color: rgb(0, 0, 0)
            });

        if (context?.data.profileData.disposition === 'improved') {
          firstPage.drawRectangle({
            x: 33,
            y: height - 420,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.disposition === 'recovered') {
          firstPage.drawRectangle({
            x: 33,
            y: height - 435,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.disposition === 'hama') {
          firstPage.drawRectangle({
            x: 33,
            y: height - 450,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.disposition === 'absconded') {
          firstPage.drawRectangle({
            x: 33,
            y: height - 465,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.disposition === 'expired') {
          firstPage.drawRectangle({
            x: 190.5,
            y: height - 420,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.disposition === 'transferred') {
          firstPage.drawRectangle({
            x: 190.5,
            y: height - 435,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        firstPage.drawText(
          context?.data.profileData?.admission_diagnosis?.toUpperCase() ?? '',
          {
            x: 30,
            y: height - 515,
            size: 12,
            font: courierFont
          }
        );

        break;

      case 'print-phealth-cf3':
        const panCf3 = aboutUsData?.[0]?.accreditation_no.toString() ?? '';
        let xAxisPanCf3 = 287;
        for (let i = 0; i < panCf3.length; i++) {
          firstPage.drawText(panCf3[i], {
            x: xAxisPanCf3,
            y: height - 172,
            size: 13,
            font: courierFont
          });

          xAxisPanCf3 += 17;
        }
        firstPage.drawText(
          `${context?.data.profileData.user_data_info?.last_name}, ${context?.data.profileData.user_data_info?.first_name} ${context?.data.profileData.user_data_info?.suffix ?? ''} ${context?.data.profileData.user_data_info?.middle_name}`,
          {
            x: 40,
            // y: height - 250,
            y: height - 217,
            size: 12,
            font: courierFont
          }
        );

        const chiefComplainCf3 =
          context?.data.profileData.cr_chief_complain ?? '';
        const wrappedChiefComplainCf3 = drawWrappedText(
          chiefComplainCf3,
          140,
          courierFont,
          10
        );

        let currentChiefComplainCf3 = height - 217;
        const lineSpacingChiefComplainCf3 = 11; // Adjust as needed

        for (const line of wrappedChiefComplainCf3) {
          firstPage.drawText(line, {
            x: 435,
            y: currentChiefComplainCf3,
            size: 9,
            font: courierFont
          });
          currentChiefComplainCf3 -= lineSpacingChiefComplainCf3;
        }

        firstPage.drawText(`${mm.split('').join(' ') ?? ''}`, {
          x: 106,
          y: height - 252,
          size: 10,
          font: courierFont
        });
        firstPage.drawText(`${dd.split('').join(' ') ?? ''}`, {
          x: 145,
          y: height - 252,
          size: 10,
          font: courierFont
        });
        firstPage.drawText(`${yyyy.split('').join(' ') ?? ''}`, {
          x: 185,
          y: height - 252,
          size: 10,
          font: courierFont
        });
        firstPage.drawText(
          `${timePeriod === 'AM' ? formattedAdmissionTime : ''}`,
          { x: 311, y: height - 252, size: 8, font: courierFont }
        );
        firstPage.drawText(
          `${timePeriod === 'PM' ? formattedAdmissionTime : ''}`,
          { x: 362, y: height - 252, size: 8, font: courierFont }
        );

        const historyPresentIllCf3 =
          context?.data.profileData.cr_history_present_ill ?? '';
        const wrappedHistoryPresentIllCf3 = drawWrappedText(
          historyPresentIllCf3,
          489,
          courierFont,
          10
        );

        let currentHistoryPresentIllCf3 = height - 334;
        const lineSpacingHistoryPresentIllCf3 = 12; // Adjust as needed

        for (const line of wrappedHistoryPresentIllCf3) {
          firstPage.drawText(line, {
            x: 50,
            y: currentHistoryPresentIllCf3,
            size: 10,
            font: courierFont
          });
          currentHistoryPresentIllCf3 -= lineSpacingHistoryPresentIllCf3;
        }

        firstPage.drawText(
          `${context?.data.profileData.cr_general_survey === 'awake_alert' ? 'Awake and Alert' : 'Altered Sensorium' ?? ''}`,
          { x: 106, y: height - 485, size: 10, font: courierFont }
        );
        firstPage.drawText(`${context?.data.profileData.vital_bp ?? ''}`, {
          x: 115,
          y: height - 508,
          size: 9,
          font: courierFont
        });
        firstPage.drawText(`${context?.data.profileData.vital_temp ?? ''}`, {
          x: 320,
          y: height - 508,
          size: 9,
          font: courierFont
        });
        // abpr cervl dmm ics pconj sunke sunkf

        firstPage.drawText(heent.includes('hesn') ? 'Essential Normal,' : '', {
          x: 98,
          y: height - 525,
          size: 6,
          font: courierFont
        });
        firstPage.drawText(
          heent.includes('abpr') ? 'Abnormal Pupillary Reaction' : '',
          { x: 165, y: height - 525, size: 6, font: courierFont }
        );
        firstPage.drawText(
          heent.includes('cervl') ? 'Cervical Lymphadenopathy,' : '',
          { x: 98, y: height - 533, size: 6, font: courierFont }
        );
        firstPage.drawText(
          heent.includes('dmm') ? 'Dry Mucuos Membrane,' : '',
          { x: 190, y: height - 533, size: 6, font: courierFont }
        );
        firstPage.drawText(heent.includes('ics') ? 'Icteric Sclerae' : '', {
          x: 265,
          y: height - 533,
          size: 6,
          font: courierFont
        });
        firstPage.drawText(heent.includes('pconj') ? 'Pale Conjunctiva,' : '', {
          x: 98,
          y: height - 542,
          size: 6,
          font: courierFont
        });
        firstPage.drawText(heent.includes('sunke') ? 'Sunken Eyeball,' : '', {
          x: 165,
          y: height - 542,
          size: 6,
          font: courierFont
        });
        firstPage.drawText(heent.includes('sunkf') ? 'Sunken Fontanelle' : '', {
          x: 225,
          y: height - 542,
          size: 6,
          font: courierFont
        });

        firstPage.drawText(
          chest_lungs.includes('chesn') ? 'Essential Normal,' : '',
          { x: 98, y: height - 554, size: 6, font: courierFont }
        );
        firstPage.drawText(
          chest_lungs.includes('lochesb') ? 'Lumps over chest/breast,' : '',
          { x: 165, y: height - 554, size: 6, font: courierFont }
        );
        firstPage.drawText(
          chest_lungs.includes('asymchex')
            ? 'Asymmetrical chest expansion,'
            : '',
          { x: 98, y: height - 562, size: 6, font: courierFont }
        );
        firstPage.drawText(chest_lungs.includes('rr') ? 'Rales/Ronchi,' : '', {
          x: 208,
          y: height - 562,
          size: 6,
          font: courierFont
        });
        firstPage.drawText(
          chest_lungs.includes('decbs') ? 'Decreased breath sounds' : '',
          { x: 258, y: height - 562, size: 6, font: courierFont }
        );
        firstPage.drawText(
          chest_lungs.includes('intrclavr')
            ? 'Intercostal retractions/clavicular retractions,'
            : '',
          { x: 98, y: height - 570, size: 6, font: courierFont }
        );
        firstPage.drawText(chest_lungs.includes('whiz') ? 'Wheezes,' : '', {
          x: 274,
          y: height - 570,
          size: 6,
          font: courierFont
        });

        firstPage.drawText(cvs.includes('cvesn') ? 'Essential Normal,' : '', {
          x: 98,
          y: height - 585,
          size: 6,
          font: courierFont
        });
        firstPage.drawText(
          cvs.includes('dabeat') ? 'Displaced apex beat,' : '',
          { x: 165, y: height - 585, size: 6, font: courierFont }
        );
        firstPage.drawText(cvs.includes('hthrills') ? 'Heaves/thrills,' : '', {
          x: 242,
          y: height - 585,
          size: 6,
          font: courierFont
        });
        firstPage.drawText(cvs.includes('pbulge') ? 'Pericardial bulge,' : '', {
          x: 98,
          y: height - 593,
          size: 6,
          font: courierFont
        });
        firstPage.drawText(
          cvs.includes('decmob') ? 'Decreased mobility,' : '',
          { x: 165, y: height - 593, size: 6, font: courierFont }
        );
        firstPage.drawText(cvs.includes('pnbeds') ? 'Pale nail beds,' : '', {
          x: 238,
          y: height - 593,
          size: 6,
          font: courierFont
        });
        firstPage.drawText(cvs.includes('pskint') ? 'Poor Skin turgor,' : '', {
          x: 98,
          y: height - 602,
          size: 6,
          font: courierFont
        });
        firstPage.drawText(cvs.includes('rashpet') ? 'Rashes/petechiae,' : '', {
          x: 165,
          y: height - 602,
          size: 6,
          font: courierFont
        });
        firstPage.drawText(cvs.includes('weakp') ? 'Weak pulses,' : '', {
          x: 230,
          y: height - 602,
          size: 6,
          font: courierFont
        });

        if (context?.data.profileData.disposition === 'improved') {
          firstPage.drawRectangle({
            x: 137,
            y: height - 948.5,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.disposition === 'transferred') {
          firstPage.drawRectangle({
            x: 222,
            y: height - 948.5,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.disposition === 'hama') {
          firstPage.drawRectangle({
            x: 312,
            y: height - 948.5,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.disposition === 'absconded') {
          firstPage.drawRectangle({
            x: 397,
            y: height - 948.5,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.disposition === 'expired') {
          firstPage.drawRectangle({
            x: 470,
            y: height - 948.5,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        break;

      case 'print-phealth-cf4':
        firstPage.drawText(aboutUsData?.[0]?.hci_name.toUpperCase() ?? '', {
          x: 50,
          y: height - 184,
          size: 10,
          font: courierFont
        });

        firstPage.drawText(aboutUsData?.[0]?.accreditation_no.toUpperCase() ?? '', {
          x: 350,
          y: height - 184,
          size: 10,
          font: courierFont
        });

        firstPage.drawText(
          `${aboutUsData?.[0]?.building_no.toUpperCase()} ${aboutUsData?.[0]?.blk.toUpperCase()}` ?? '',
          {
            x:
              45 +
              (110 -
                40 -
                courierFont.widthOfTextAtSize(
                  (aboutUsData?.[0]?.building_no ?? '') +
                    ' ' +
                    (aboutUsData?.[0]?.blk ?? ''),
                  7
                )) /
                2,
            y: height - 209,
            size: 7,
            font: courierFont
          }
        );

        firstPage.drawText(
          `${aboutUsData?.[0]?.street.toUpperCase()} ST./${aboutUsData?.[0]?.subdivision_village.toUpperCase()}` ?? '',
          {
            x:
              115 +
              (185 -
                110 -
                courierFont.widthOfTextAtSize(
                  (aboutUsData?.[0]?.street ?? '') +
                    'ST. /' +
                    (aboutUsData?.[0]?.subdivision_village ?? ''),
                  7
                )) /
                2,
            y: height - 209,
            size: 7,
            font: courierFont
          }
        );

        firstPage.drawText(
          `${aboutUsData?.[0]?.barangay_name.toUpperCase()}/${aboutUsData?.[0]?.city_name.toUpperCase() ?? aboutUsData?.[0]?.municipality_name.toUpperCase()}` ?? '',
          {
            x:
              193 +
              (290 -
                188 -
                courierFont.widthOfTextAtSize(
                  (aboutUsData?.[0]?.barangay_name ?? '') +
                    '/' +
                    (aboutUsData?.[0]?.city_name
                      ? aboutUsData?.[0]?.city_name ?? ''
                      : aboutUsData?.[0]?.municipality_name ?? ''),
                  7
                )) /
                2,
            y: height - 209,
            size: 7,
            font: courierFont
          }
        );

        firstPage.drawText(aboutUsData?.[0]?.province_name.toUpperCase() ?? '', {
          x:
            322 +
            (483 -
              317 -
              courierFont.widthOfTextAtSize(
                aboutUsData?.[0]?.province_name ?? '',
                7
              )) /
              2,
          y: height - 209,
          size: 7,
          font: courierFont
        });

        firstPage.drawText(aboutUsData?.[0]?.postal_code.toString() ?? '', {
          x:
            492 +
            (535 -
              487 -
              courierFont.widthOfTextAtSize(
                aboutUsData?.[0]?.postal_code.toString() ?? '',
                7
              )) /
              2,
          y: height - 209,
          size: 7,
          font: courierFont
        });

        firstPage.drawText(
          context?.data.profileData.user_data_info?.last_name.toUpperCase(),
          {
            x:
              50 +
              (140 -
                45 -
                courierFont.widthOfTextAtSize(
                  context?.data.profileData.user_data_info?.last_name ?? '',
                  10
                )) /
                2,
            y: height - 250,
            size: 10,
            font: courierFont
          }
        );

        firstPage.drawText(
          context?.data.profileData.user_data_info?.first_name.toUpperCase(),
          {
            x:
              157 +
              (260 -
                152 -
                courierFont.widthOfTextAtSize(
                  context?.data.profileData.user_data_info?.first_name ?? '',
                  10
                )) /
                2,
            y: height - 250,
            size: 10,
            font: courierFont
          }
        );

        firstPage.drawText(
          context?.data.profileData.user_data_info?.middle_name.toUpperCase(),
          {
            x:
              273 +
              (395 -
                268 -
                courierFont.widthOfTextAtSize(
                  context?.data.profileData.user_data_info?.middle_name ?? '',
                  10
                )) /
                2,
            y: height - 249,
            size: 10,
            font: courierFont
          }
        );

        const chiefComplainCf4 =
          context?.data.profileData.cr_chief_complain ?? '';
        const wrappedChiefComplainCf4 = drawWrappedText(
          chiefComplainCf4,
          415,
          courierFont,
          10
        );

        let currentChiefComplainCf4 = height - 278;
        const lineSpacingChiefComplainCf4 = 8; // Adjust as needed

        for (const line of wrappedChiefComplainCf4) {
          firstPage.drawText(line, {
            x: 50,
            y: currentChiefComplainCf4,
            size: 9,
            font: courierFont
          });
          currentChiefComplainCf4 -= lineSpacingChiefComplainCf4;
        }

        // console.log(context?.data.profileData.user_data_info?.age)
        firstPage.drawText(
          context?.data.profileData.user_data_info?.age.toString() ?? '',
          { x: 451, y: height - 265, size: 10, font: courierFont }
        );

        if (context?.data.profileData.user_data_info?.gender === 'male') {
          firstPage.drawRectangle({
            x: 451,
            y: height - 285,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.user_data_info?.gender === 'female') {
          firstPage.drawRectangle({
            x: 483.5,
            y: height - 285,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        const admissionDiagnosisText =
          context?.data.profileData.admission_diagnosis?.toUpperCase() ?? '';
        const wrappedAdmissionDianosis = drawWrappedText(
          admissionDiagnosisText,
          245,
          courierFont,
          13
        );

        let currentAdmissionDiagnosis = height - 310;
        const lineSpacingAdmissionDiagnosis = 8; // Adjust as needed

        for (const line of wrappedAdmissionDianosis) {
          firstPage.drawText(line, {
            x: 45,
            y: currentAdmissionDiagnosis,
            size: 9,
            font: courierFont
          });
          currentAdmissionDiagnosis -= lineSpacingAdmissionDiagnosis;
        }

        const dischargeDiagnosisText =
          context?.data.profileData.discharge_diagnosis?.toUpperCase() ?? '';
        const wrappedDischargeDianosis = drawWrappedText(
          dischargeDiagnosisText,
          245,
          courierFont,
          13
        );

        let currentDischargeDiagnosis = height - 310;
        const lineSpacingDischargeDiagnosis = 8; // Adjust as needed

        for (const line of wrappedDischargeDianosis) {
          firstPage.drawText(line, {
            x: 220,
            y: currentDischargeDiagnosis,
            size: 9,
            font: courierFont
          });
          currentDischargeDiagnosis -= lineSpacingDischargeDiagnosis;
        }

        const historyPresentIllText =
          context?.data.profileData.cr_history_present_ill ?? '';
        const wrappedHistoryPresentIll = drawWrappedText(
          historyPresentIllText,
          489,
          courierFont,
          10
        );

        let currentHistoryPresentIll = height - 410;
        const lineSpacingHistoryPresentIll = 12; // Adjust as needed

        for (const line of wrappedHistoryPresentIll) {
          firstPage.drawText(line, {
            x: 50,
            y: currentHistoryPresentIll,
            size: 10,
            font: courierFont
          });
          currentHistoryPresentIll -= lineSpacingHistoryPresentIll;
        }

        const historyPastMedicalHistory =
          context?.data.profileData.cr_past_med_history ?? '';
        const wrappedPastMedicalHistory = drawWrappedText(
          historyPastMedicalHistory,
          489,
          courierFont,
          10
        );

        let currentPastMedicalHistory = height - 506;
        const lineSpacingPastMedicalHistory = 12; // Adjust as needed

        for (const line of wrappedPastMedicalHistory) {
          firstPage.drawText(line, {
            x: 50,
            y: currentPastMedicalHistory,
            size: 10,
            font: courierFont
          });
          currentPastMedicalHistory -= lineSpacingPastMedicalHistory;
        }

        const admissionDateCf4 = new Date(
          context?.data.profileData.admission_date
        );
        const formattedDateTimeCf4 = admissionDateCf4.toLocaleString('en-US', {
          month: '2-digit',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit', // 12-hour format
          minute: '2-digit',
          hour12: false // Ensures AM/PM is included
        });

        const [formattedAdmissionDateCf4, formattedAdmissionTimeCf4] =
          formattedDateTimeCf4.split(' ');
        const [hourCf4, minuteCf4] = formattedAdmissionTimeCf4.split(':');
        const [mmCf4, ddCf4, yyyyCf4] = formattedAdmissionDateCf4.split('/');
        const timePeriodCf4 = hourCf4 >= 12 ? 'PM' : 'AM';
        let xAxisHour = 396;
        let xAxisMinute = 428;

        firstPage.drawText(`${mmCf4.split('').join(' ') ?? ''}`, {
          x: 124,
          y: height - 347,
          size: 10,
          font: courierFont
        });
        firstPage.drawText(`${ddCf4.split('').join(' ') ?? ''}`, {
          x: 154,
          y: height - 347,
          size: 10,
          font: courierFont
        });
        firstPage.drawText(`${yyyyCf4.split('').join(' ') ?? ''}`, {
          x: 187,
          y: height - 347,
          size: 10,
          font: courierFont
        });
        for (let i = 0; i < hourCf4.length; i++) {
          firstPage.drawText(hourCf4[i], {
            x: xAxisHour,
            y: height - 347,
            size: 8,
            font: courierFont
          });
          xAxisHour += 12;
        }
        for (let i = 0; i < minuteCf4.length; i++) {
          firstPage.drawText(minuteCf4[i], {
            x: xAxisMinute,
            y: height - 347,
            size: 8,
            font: courierFont
          });
          xAxisMinute += 12;
        }
        if (timePeriodCf4 === 'AM') {
          firstPage.drawRectangle({
            x: 450,
            y: height - 350,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }
        if (timePeriodCf4 === 'PM') {
          firstPage.drawRectangle({
            x: 474.5,
            y: height - 350,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        firstPage.drawText(
          `${context?.data.profileData.cr_general_survey === 'awake_alert' ? 'H' : ''}`,
          { x: 120, y: height - 813, size: 12 }
        );
        firstPage.drawText(
          `${context?.data.profileData.cr_general_survey === 'awake_alert' ? 'H' : ''}`,
          { x: 121, y: height - 813, size: 12 }
        );
        firstPage.drawText(
          `${context?.data.profileData.cr_general_survey === 'awake_alert' ? 'H' : ''}`,
          { x: 122, y: height - 813, size: 12 }
        );
        firstPage.drawText(
          `${context?.data.profileData.cr_general_survey === 'awake_alert' ? 'H' : ''}`,
          { x: 123, y: height - 813, size: 12 }
        );
        firstPage.drawText(
          `${context?.data.profileData.cr_general_survey === 'awake_alert' ? 'H' : ''}`,
          { x: 124, y: height - 813, size: 12 }
        );
        firstPage.drawText(
          `${context?.data.profileData.cr_general_survey === 'awake_alert' ? 'H' : ''}`,
          { x: 125, y: height - 813, size: 12 }
        );

        firstPage.drawText(
          `${context?.data.profileData.cr_general_survey === 'altered_sensorium' ? 'H' : ''}`,
          { x: 218, y: height - 813, size: 12 }
        );
        firstPage.drawText(
          `${context?.data.profileData.cr_general_survey === 'altered_sensorium' ? 'H' : ''}`,
          { x: 219, y: height - 813, size: 12 }
        );
        firstPage.drawText(
          `${context?.data.profileData.cr_general_survey === 'altered_sensorium' ? 'H' : ''}`,
          { x: 220, y: height - 813, size: 12 }
        );
        firstPage.drawText(
          `${context?.data.profileData.cr_general_survey === 'altered_sensorium' ? 'H' : ''}`,
          { x: 221, y: height - 813, size: 12 }
        );
        firstPage.drawText(
          `${context?.data.profileData.cr_general_survey === 'altered_sensorium' ? 'H' : ''}`,
          { x: 222, y: height - 813, size: 12 }
        );
        firstPage.drawText(
          `${context?.data.profileData.cr_general_survey === 'altered_sensorium' ? 'H' : ''}`,
          { x: 223, y: height - 813, size: 12 }
        );

        firstPage.drawText(`${context?.data.profileData.vital_height ?? ''}`, {
          x: 465,
          y: height - 800,
          size: 10
        });
        firstPage.drawText(`${context?.data.profileData.vital_weight ?? ''}`, {
          x: 465,
          y: height - 815,
          size: 10
        });
        firstPage.drawText(`${context?.data.profileData.vital_bp ?? ''}`, {
          x: 150,
          y: height - 840,
          size: 10
        });
        firstPage.drawText(`${context?.data.profileData.vital_hr ?? ''}`, {
          x: 250,
          y: height - 840,
          size: 10
        });
        firstPage.drawText(`${context?.data.profileData.vital_temp ?? ''}`, {
          x: 450,
          y: height - 840,
          size: 10
        });

        if (context?.data.profileData.cr_symptoms?.includes('altmentsens')) {
          firstPage.drawRectangle({
            x: 48,
            y: height - 605.5,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_symptoms?.includes('abdcrmp')) {
          firstPage.drawRectangle({
            x: 48,
            y: height - 620.5,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_symptoms?.includes('anrx')) {
          firstPage.drawRectangle({
            x: 48,
            y: height - 635,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_symptoms?.includes('bldgums')) {
          firstPage.drawRectangle({
            x: 48,
            y: height - 650,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_symptoms?.includes('bodywkn')) {
          firstPage.drawRectangle({
            x: 48,
            y: height - 665,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_symptoms?.includes('blrofvis')) {
          firstPage.drawRectangle({
            x: 48,
            y: height - 680,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_symptoms?.includes('chestpndisc')) {
          firstPage.drawRectangle({
            x: 48,
            y: height - 695,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_symptoms?.includes('constpn')) {
          firstPage.drawRectangle({
            x: 48,
            y: height - 710,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_symptoms?.includes('cuf')) {
          firstPage.drawRectangle({
            x: 48,
            y: height - 725,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_symptoms?.includes('drhea')) {
          firstPage.drawRectangle({
            x: 161,
            y: height - 605,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_symptoms?.includes('dzness')) {
          firstPage.drawRectangle({
            x: 161,
            y: height - 620,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_symptoms?.includes('dysphg')) {
          firstPage.drawRectangle({
            x: 161,
            y: height - 635,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_symptoms?.includes('dyspn')) {
          firstPage.drawRectangle({
            x: 161,
            y: height - 650,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_symptoms?.includes('dysur')) {
          firstPage.drawRectangle({
            x: 161,
            y: height - 665,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_symptoms?.includes('epstxs')) {
          firstPage.drawRectangle({
            x: 161,
            y: height - 679.5,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_symptoms?.includes('fver')) {
          firstPage.drawRectangle({
            x: 161,
            y: height - 694.5,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_symptoms?.includes('freqofuri')) {
          firstPage.drawRectangle({
            x: 161,
            y: height - 709.5,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_symptoms?.includes('hdache')) {
          firstPage.drawRectangle({
            x: 160,
            y: height - 725,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_symptoms?.includes('hmtemsis')) {
          firstPage.drawRectangle({
            x: 267.5,
            y: height - 605,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_symptoms?.includes('hmtur')) {
          firstPage.drawRectangle({
            x: 267.5,
            y: height - 620,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_symptoms?.includes('hmptys')) {
          firstPage.drawRectangle({
            x: 267.5,
            y: height - 635,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_symptoms?.includes('irtblty')) {
          firstPage.drawRectangle({
            x: 267.5,
            y: height - 649.5,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_symptoms?.includes('jndc')) {
          firstPage.drawRectangle({
            x: 267.5,
            y: height - 665,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_symptoms?.includes('lowexedm')) {
          firstPage.drawRectangle({
            x: 267.5,
            y: height - 679.5,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_symptoms?.includes('mylg')) {
          firstPage.drawRectangle({
            x: 267.5,
            y: height - 694,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_symptoms?.includes('orthpn')) {
          firstPage.drawRectangle({
            x: 267.5,
            y: height - 709.5,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_symptoms?.includes('pain')) {
          firstPage.drawRectangle({
            x: 267.5,
            y: height - 724.5,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_symptoms?.includes('palptns')) {
          firstPage.drawRectangle({
            x: 376.5,
            y: height - 605,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_symptoms?.includes('szrs')) {
          firstPage.drawRectangle({
            x: 376.5,
            y: height - 620,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_symptoms?.includes('srash')) {
          firstPage.drawRectangle({
            x: 376.5,
            y: height - 635,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_symptoms?.includes('stoolbbm')) {
          firstPage.drawRectangle({
            x: 376.5,
            y: height - 650,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_symptoms?.includes('swtng')) {
          firstPage.drawRectangle({
            x: 376.5,
            y: height - 665,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_symptoms?.includes('urgn')) {
          firstPage.drawRectangle({
            x: 376.5,
            y: height - 679.5,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_symptoms?.includes('vmtng')) {
          firstPage.drawRectangle({
            x: 376,
            y: height - 695,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_symptoms?.includes('wloss')) {
          firstPage.drawRectangle({
            x: 376.5,
            y: height - 710,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_symptoms?.includes('others')) {
          firstPage.drawRectangle({
            x: 376.5,
            y: height - 725,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_heent?.includes('hesn')) {
          firstPage.drawRectangle({
            x: 120,
            y: height - 861.5,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_heent?.includes('ics')) {
          firstPage.drawRectangle({
            x: 120,
            y: height - 875,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_heent?.includes('abpr')) {
          firstPage.drawRectangle({
            x: 219.5,
            y: height - 861.5,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_heent?.includes('pconj')) {
          firstPage.drawRectangle({
            x: 219.5,
            y: height - 875,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_heent?.includes('cervl')) {
          firstPage.drawRectangle({
            x: 327,
            y: height - 861,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_heent?.includes('sunke')) {
          firstPage.drawRectangle({
            x: 327,
            y: height - 874.5,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_heent?.includes('dmm')) {
          firstPage.drawRectangle({
            x: 427,
            y: height - 861,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_heent?.includes('sunkf')) {
          firstPage.drawRectangle({
            x: 427,
            y: height - 874.5,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_chest_lungs?.includes('chesn')) {
          secondPage.drawRectangle({
            x: 121,
            y: height - 94,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_chest_lungs?.includes('lochesb')) {
          secondPage.drawRectangle({
            x: 120.5,
            y: height - 108.5,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_chest_lungs?.includes('asymchex')) {
          secondPage.drawRectangle({
            x: 219.5,
            y: height - 94,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_chest_lungs?.includes('rr')) {
          secondPage.drawRectangle({
            x: 219.5,
            y: height - 109,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_chest_lungs?.includes('decbs')) {
          secondPage.drawRectangle({
            x: 327,
            y: height - 94,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_chest_lungs?.includes('intrclavr')) {
          secondPage.drawRectangle({
            x: 327,
            y: height - 109,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_chest_lungs?.includes('whiz')) {
          secondPage.drawRectangle({
            x: 427,
            y: height - 94.5,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_cvs?.includes('cvesn')) {
          secondPage.drawRectangle({
            x: 120.8,
            y: height - 140,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_cvs?.includes('dabeat')) {
          secondPage.drawRectangle({
            x: 220,
            y: height - 140,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_cvs?.includes('hthrills')) {
          secondPage.drawRectangle({
            x: 327,
            y: height - 140,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_cvs?.includes('pbulge')) {
          secondPage.drawRectangle({
            x: 427,
            y: height - 140.5,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_cvs?.includes('irregrhy')) {
          secondPage.drawRectangle({
            x: 120.8,
            y: height - 154.5,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_cvs?.includes('muffhrtsnds')) {
          secondPage.drawRectangle({
            x: 220,
            y: height - 154.5,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (context?.data.profileData.cr_cvs?.includes('mrmr')) {
          secondPage.drawRectangle({
            x: 327,
            y: height - 154.5,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (
          context?.data.profileData.cr_neurological_exam?.includes('neoesn')
        ) {
          secondPage.drawRectangle({
            x: 120.4,
            y: height - 325,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (
          context?.data.profileData.cr_neurological_exam?.includes('abgait')
        ) {
          secondPage.drawRectangle({
            x: 219.5,
            y: height - 325,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (
          context?.data.profileData.cr_neurological_exam?.includes('abposens')
        ) {
          secondPage.drawRectangle({
            x: 327,
            y: height - 325,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (
          context?.data.profileData.cr_neurological_exam?.includes('abdecsens')
        ) {
          secondPage.drawRectangle({
            x: 426.5,
            y: height - 325.5,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (
          context?.data.profileData.cr_neurological_exam?.includes('abreflex')
        ) {
          secondPage.drawRectangle({
            x: 120.4,
            y: height - 340,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (
          context?.data.profileData.cr_neurological_exam?.includes('poormem')
        ) {
          secondPage.drawRectangle({
            x: 219.5,
            y: height - 340,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (
          context?.data.profileData.cr_neurological_exam?.includes(
            'poormustren'
          )
        ) {
          secondPage.drawRectangle({
            x: 327,
            y: height - 340,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        if (
          context?.data.profileData.cr_neurological_exam?.includes('poorcond')
        ) {
          secondPage.drawRectangle({
            x: 426.5,
            y: height - 340,
            width: 12,
            height: 12,
            color: rgb(0, 0, 0)
          });
        }

        secondPage.drawText(
          `${context?.data.profileData.disposition === 'improved' ? 'H' : ''}`,
          { x: 45, y: height - 820, size: 12 }
        );
        secondPage.drawText(
          `${context?.data.profileData.disposition === 'improved' ? 'H' : ''}`,
          { x: 46, y: height - 820, size: 12 }
        );
        secondPage.drawText(
          `${context?.data.profileData.disposition === 'improved' ? 'H' : ''}`,
          { x: 47, y: height - 820, size: 12 }
        );
        secondPage.drawText(
          `${context?.data.profileData.disposition === 'improved' ? 'H' : ''}`,
          { x: 48, y: height - 820, size: 12 }
        );
        secondPage.drawText(
          `${context?.data.profileData.disposition === 'improved' ? 'H' : ''}`,
          { x: 49, y: height - 820, size: 12 }
        );
        secondPage.drawText(
          `${context?.data.profileData.disposition === 'improved' ? 'H' : ''}`,
          { x: 50, y: height - 820, size: 12 }
        );

        secondPage.drawText(
          `${context?.data.profileData.disposition === 'hama' ? 'H' : ''}`,
          { x: 153, y: height - 820, size: 12 }
        );
        secondPage.drawText(
          `${context?.data.profileData.disposition === 'hama' ? 'H' : ''}`,
          { x: 154, y: height - 820, size: 12 }
        );
        secondPage.drawText(
          `${context?.data.profileData.disposition === 'hama' ? 'H' : ''}`,
          { x: 155, y: height - 820, size: 12 }
        );
        secondPage.drawText(
          `${context?.data.profileData.disposition === 'hama' ? 'H' : ''}`,
          { x: 156, y: height - 820, size: 12 }
        );
        secondPage.drawText(
          `${context?.data.profileData.disposition === 'hama' ? 'H' : ''}`,
          { x: 157, y: height - 820, size: 12 }
        );
        secondPage.drawText(
          `${context?.data.profileData.disposition === 'hama' ? 'H' : ''}`,
          { x: 158, y: height - 820, size: 12 }
        );

        // secondPage.drawText(`${context?.data.profileData.disposition === 'u48h' ? 'H' : ''}`,  { x: 153,  y: height - 820, size: 12})
        // secondPage.drawText(`${context?.data.profileData.disposition === 'u48h' ? 'H' : ''}`,  { x: 154,  y: height - 820, size: 12})
        // secondPage.drawText(`${context?.data.profileData.disposition === 'u48h' ? 'H' : ''}`,  { x: 155,  y: height - 820, size: 12})
        // secondPage.drawText(`${context?.data.profileData.disposition === 'u48h' ? 'H' : ''}`,  { x: 156,  y: height - 820, size: 12})
        // secondPage.drawText(`${context?.data.profileData.disposition === 'u48h' ? 'H' : ''}`,  { x: 157,  y: height - 820, size: 12})
        // secondPage.drawText(`${context?.data.profileData.disposition === 'u48h' ? 'H' : ''}`,  { x: 158,  y: height - 820, size: 12})

        // secondPage.drawText(`${context?.data.profileData.disposition === 'transferred' ? 'H' : ''}`,  { x: 120,  y: height - 820, size: 12})
        // secondPage.drawText(`${context?.data.profileData.disposition === 'transferred' ? 'H' : ''}`,  { x: 98,  y: height - 820, size: 12})
        // secondPage.drawText(`${context?.data.profileData.disposition === 'transferred' ? 'H' : ''}`,  { x: 99,  y: height - 820, size: 12})
        // secondPage.drawText(`${context?.data.profileData.disposition === 'transferred' ? 'H' : ''}`,  { x: 100,  y: height - 820, size: 12})
        // secondPage.drawText(`${context?.data.profileData.disposition === 'transferred' ? 'H' : ''}`,  { x: 101,  y: height - 820, size: 12})
        // secondPage.drawText(`${context?.data.profileData.disposition === 'transferred' ? 'H' : ''}`,  { x: 102,  y: height - 820, size: 12})

        break;

      case 'print-prescription':
        firstPage.drawText(
          `${context?.data.profileData.user_data_info?.last_name}, ${context?.data.profileData.user_data_info?.first_name}`,
          {
            x: 120,
            // y: height - 250,
            y: height - 136,
            size: 12,
            font: courierFont
          }
        );

        secondPage.drawText(
          `${context?.data.profileData.user_data_info?.last_name}, ${context?.data.profileData.user_data_info?.first_name}`,
          {
            x: 120,
            // y: height - 250,
            y: height - 136,
            size: 12,
            font: courierFont
          }
        );

        const dateNow = Date.now();
        const months = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec'
        ]; // Array of month names
        const dateObj = new Date(dateNow);
        const monthName = months[dateObj.getMonth()];
        const day = dateObj.getDate();
        const year = dateObj.getFullYear();
        const formattedDate = `${monthName}/${day}/${year}`;
        firstPage.drawText(`${formattedDate}`, {
          x: 465,
          // y: height - 250,
          y: height - 136,
          size: 12,
          font: courierFont
        });

        secondPage.drawText(`${formattedDate}`, {
          x: 465,
          // y: height - 250,
          y: height - 136,
          size: 12,
          font: courierFont
        });

        let currentY = height - 350;
        context?.data.medication.map((item) => {
          const text = `${item?.medicine.brand_name}/${item.dose} Sig:${item.form}/${item.frequency}`;
          const textSize = 15;
          // const textWidth = courierFont.widthOfTextAtSize(text, textSize) // Measure text width

          secondPage.drawText(text, {
            x: 120,
            // y: height - 250,
            // y: height - 450,
            y: currentY,
            size: textSize,
            font: courierFont
          });
          currentY -= courierFont.heightAtSize(50);
        });

        break;

      default:
        break;
    }

    const pdfBytes = await pdfDoc.save();
    // Do something with the generated PDF bytes, e.g. download
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.target = '_blank';
    // link.download = 'generated_prescription.pdf'
    link.click();
  };

  return (
    <button
      onClick={() => {
        setPdfLink(category);
        handleGeneratePDF({ type: category });
      }}
      className={`${context?.state.isOptionEditDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} w-full text-left block px-4 py-1 font-medium text-xs leading-5 text-gray-500 hover:bg-gray-100 focus:outline-none transition duration-150 ease-in-out`}
      disabled={context?.state.isOptionEditDisabled}
    >
      {context?.state.title}
    </button>
  );
});

export default PdfGenerator;
