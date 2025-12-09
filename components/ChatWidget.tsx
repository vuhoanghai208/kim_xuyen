import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { Translation, ChatMessage } from '../types';

interface ChatWidgetProps {
  t: Translation['chat'];
}

// Hàm chọn ngẫu nhiên câu trả lời để tạo cảm giác tự nhiên
const pickRandom = (answers: string[]) => {
  return answers[Math.floor(Math.random() * answers.length)];
};

const getResponse = (userInput: string): string => {
  const input = userInput.toLowerCase();

  // --- 1. TAI NẠN & KHẨN CẤP (Cần sự đồng cảm + Chính xác) ---
  if (input.includes('tai nạn') || input.includes('va chạm') || input.includes('tông xe')) {
    return pickRandom([
      '🚨 Bình tĩnh nhé! Nếu có tai nạn: Dừng xe ngay, giữ nguyên hiện trường và cấp cứu người bị nạn. Tuyệt đối không được bỏ chạy nhé, phạt rất nặng đấy (16-18 triệu + tước bằng)!',
      'Nguy hiểm quá! Bạn nhớ dừng xe lại ngay, đừng di chuyển xe khỏi hiện trường. Gọi ngay cho CSGT hoặc Cấp cứu 115. Bỏ chạy là vi phạm hình sự đấy!',
      'Trước hết hãy xem có ai bị thương không và gọi cấp cứu. Nhớ giữ nguyên hiện trường để công an giải quyết. Đừng vì hoảng sợ mà bỏ trốn nhé.'
    ]);
  }

  // --- 2. NỒNG ĐỘ CỒN (Cảnh báo gay gắt) ---
  if (input.includes('rượu') || input.includes('bia') || input.includes('uống') || input.includes('cồn')) {
    return pickRandom([
      '🍺 Đã uống rượu bia thì TỐT NHẤT là bắt Grab/Taxi về bạn ơi! Luật 2025 phạt rất căng: Vừa phạt tiền, vừa TRỪ ĐIỂM, vừa tước bằng đấy.',
      'Đừng lái xe khi đã uống nhé! Dù chỉ một chút cũng vi phạm "Zero Alcohol". Bị thổi nồng độ cồn là "bay" luôn cái bằng lái đấy.',
      'Khuyên thật lòng: Đã nhậu là không lái xe. Mức phạt kịch khung rất cao, chưa kể còn bị trừ sạch điểm bằng lái. An toàn là trên hết!'
    ]);
  }

  // --- 3. GIẤY TỜ & VNEID (Thông tin hữu ích) ---
  if (input.includes('giấy tờ') || input.includes('vneid') || input.includes('mang theo') || input.includes('quên bằng')) {
    return pickRandom([
      '📱 Tin vui là bạn có thể dùng VNeID thay cho giấy tờ giấy (nếu đã tích hợp). Nếu chưa có thì nhớ mang đủ: Đăng ký xe, Bằng lái, Bảo hiểm nhé.',
      'Giờ đi đường tiện hơn rồi, CSGT chấp nhận kiểm tra giấy tờ trên app VNeID. Nhưng nhớ là phải "tích hợp" rồi mới được nha.',
      'Đi xe nhớ mang: Đăng ký, Bằng lái, Bảo hiểm. Nếu lỡ quên ở nhà thì mở VNeID lên xuất trình cũng được tính hợp lệ nhé!'
    ]);
  }
  // --- CHI TIẾT: THỨ TỰ XE ƯU TIÊN (AI ĐI TRƯỚC?) ---
  if (input.includes('xe ưu tiên') || input.includes('nhường đường') || input.includes('cứu thương') || input.includes('cứu hỏa')) {
    return 'Thứ tự quyền ưu tiên đi trước khi qua giao lộ (từ cao xuống thấp):\n1. Xe chữa cháy đi làm nhiệm vụ.\n2. Xe quân sự, xe công an đi làm nhiệm vụ.\n3. Xe cứu thương đang thực hiện cấp cứu.\n4. Xe hộ đê, xe đi khắc phục thiên tai, dịch bệnh.\n5. Đoàn xe tang.\n⚠️ Lưu ý: Khi nghe tín hiệu của xe ưu tiên, bạn phải giảm tốc độ và nhường đường ngay lập tức.';
  }

  // --- CHI TIẾT: QUY TẮC ĐI TRÊN ĐƯỜNG CAO TỐC ---
  if (input.includes('cao tốc') || input.includes('làn khẩn cấp') || input.includes('lùi xe')) {
    return 'Quy tắc "sống còn" trên cao tốc:\n• Tuyệt đối KHÔNG đi vào làn dừng khẩn cấp (trừ khi xe hỏng).\n• Tuyệt đối KHÔNG lùi xe, quay đầu xe, đi ngược chiều (Phạt 16-18 triệu + Tước bằng 5-7 tháng).\n• Phải tuân thủ khoảng cách an toàn ghi trên biển báo (0m, 50m, 100m).\n• Chỉ được dừng, đỗ xe ở nơi quy định (trạm dừng nghỉ).';
  }

  // --- CHI TIẾT: TỐC ĐỘ TỐI ĐA CHO PHÉP ---
  if (input.includes('tốc độ tối đa') || input.includes('khu đông dân cư') || input.includes('ngoài đô thị')) {
    return 'Giới hạn tốc độ xe máy & ô tô con (trừ đường cao tốc):\n• Trong khu đông dân cư: 50 km/h (đường đôi/đường 1 chiều có 2 làn trở lên); 40 km/h (đường 2 chiều/đường 1 chiều có 1 làn).\n• Ngoài khu đông dân cư: 90 km/h (đường đôi); 80 km/h (đường 2 chiều).\n• Xe máy chuyên dùng, xe gắn máy (dưới 50cc): Tối đa 40 km/h không phân biệt đường.';
  }

  // --- CHI TIẾT: QUY ĐỊNH VỀ NỒNG ĐỘ CỒN (CẤM TUYỆT ĐỐI) ---
  if (input.includes('nồng độ cồn') || input.includes('uống rượu') || input.includes('bia') || input.includes('thổi nồng độ')) {
    return 'Việt Nam áp dụng "Zero Alcohol" (Nồng độ cồn bằng 0):\n• Mức 1 (≤ 50mg/100ml máu): Phạt tiền + Tước bằng lái 10-12 tháng.\n• Mức 2 (50-80mg/100ml máu): Phạt tiền cao hơn + Tước bằng 16-18 tháng.\n• Mức 3 (> 80mg/100ml máu): Phạt kịch khung (Xe máy 6-8tr, Ô tô 30-40tr) + Tước bằng 22-24 tháng.\n👉 Đã uống rượu bia thì KHÔNG lái xe!';
  }

  // --- CHI TIẾT: BẢO HIỂM BẮT BUỘC (TNDS) ---
  if (input.includes('bảo hiểm') || input.includes('bắt buộc') || input.includes('tự nguyện')) {
    return 'Phân biệt Bảo hiểm xe:\n• Bảo hiểm TNDS Bắt buộc (tờ màu vàng/nâu): BẮT BUỘC phải có. Nếu không có sẽ bị phạt 100k-200k (xe máy) hoặc 400k-600k (ô tô). CSGT chấp nhận bản điện tử trên điện thoại.\n• Bảo hiểm thân vỏ/người ngồi trên xe: Là Tự nguyện, mua để bảo vệ quyền lợi cá nhân, CSGT không phạt nếu thiếu cái này.';
  }

  // --- CHI TIẾT: QUYỀN ƯU TIÊN NGƯỜI ĐI BỘ ---
  if (input.includes('đi bộ') || input.includes('vạch kẻ đường') || input.includes('sang đường')) {
    return 'Quy định nhường đường cho người đi bộ:\n• Tại nơi có vạch kẻ đường: Lái xe PHẢI quan sát, giảm tốc độ và nhường đường cho người đi bộ.\n• Tại nơi KHÔNG có vạch kẻ: Nếu thấy người đi bộ đang qua đường, lái xe cũng phải giảm tốc độ và nhường đường để đảm bảo an toàn.\n• Luật mới 2024 bảo vệ rất cao cho nhóm yếu thế (trẻ em, người già, người khuyết tật).';
  }
  // --- 31. TRA CỨU BIỂN SỐ XE (Các TP lớn) ---
  if (input.includes('biển số') || input.includes('biển xe')) {
    if (input.includes('hà nội') || input.includes('29') || input.includes('30')) {
      return 'Biển số Hà Nội là: 29, 30, 31, 32, 33, 40. Thủ đô đất chật người đông, đi lại nhớ kiên nhẫn nhé!';
    }
    if (input.includes('hcm') || input.includes('sài gòn') || input.includes('50') || input.includes('59')) {
      return 'Biển số TP.HCM (Sài Gòn) là: 41, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59. Thành phố không ngủ, cẩn thận kẹt xe giờ cao điểm nha.';
    }
    if (input.includes('đà nẵng') || input.includes('43')) {
      return 'Biển số Đà Nẵng là: 43. Thành phố của những cây cầu, nhớ đừng dừng xe trên cầu Rồng để quay phim lúc phun lửa nha, bị phạt đó ^^';
    }
    if (input.includes('hải phòng') || input.includes('15') || input.includes('16')) {
      return 'Biển số Hải Phòng là: 15, 16. Thành phố hoa phượng đỏ, đường xá rộng nhưng nhiều xe Container, đi cẩn thận nhé.';
    }
    // Mặc định nếu hỏi chung chung
    return pickRandom([
      'Bạn muốn tra biển số tỉnh nào? Ví dụ: "Biển số Hà Nội", "Biển số 61 ở đâu?"...',
      'Mỗi tỉnh có đầu số riêng. Hà Nội (29-33), TP.HCM (50-59), Đà Nẵng (43)... Bạn cần tìm tỉnh nào?',
      'Việt Nam có 63 tỉnh thành với nhiều đầu biển số khác nhau. Nhập tên tỉnh hoặc số để mình tra giúp cho!'
    ]);
  }

  // --- 32. NINJA LEAD / TRANG PHỤC CHỐNG NẮNG ---
  if (input.includes('ninja') || input.includes('áo chống nắng') || input.includes('bịt kín')) {
    return pickRandom([
      '🥷 "Ninja Lead" là huyền thoại đường phố Việt Nam! Nhưng nhắc nhỏ: Mặc áo chống nắng đừng để trùm kín gương chiếu hậu hay đèn xi nhan nhé.',
      'Che nắng là tốt, nhưng đừng bịt kín quá làm giảm tầm nhìn hai bên. Khi rẽ nhớ quay đầu quan sát kỹ vì áo trùm đầu rất khó nghe tiếng còi xe khác.',
      'Gặp các "Ninja" trên đường thì tốt nhất là giữ khoảng cách xa xa chút. Các chị em hay có những pha "xi nhan trái nhưng rẽ phải" bất ngờ lắm ^^.'
    ]);
  }

  // --- 33. ĐI PHƯỢT / ĐƯỜNG ĐÈO (Hà Giang, Đà Lạt...) ---
  if (input.includes('phượt') || input.includes('đèo') || input.includes('đi đà lạt') || input.includes('hà giang')) {
    return pickRandom([
      '🏔️ Đi phượt đường đèo (như Hà Giang, Tam Đảo) nhớ quy tắc: Lên số nào, xuống số đó! Tuyệt đối không rà phanh liên tục kẻo cháy phanh là mất lái đấy.',
      'Đi đèo sương mù nhớ bật đèn vàng hoặc dán decal vàng vào đèn. Bấm còi khi vào cua khuất tầm nhìn để báo hiệu cho xe ngược chiều.',
      'Trời mưa đường đèo rất trơn. Hạn chế phanh gấp, giữ khoảng cách xa hơn bình thường. An toàn là trên hết, đừng mải ngắm cảnh mà quên lái xe!'
    ]);
  }

  // --- 34. HẦM THỦ THIÊM / HẦM SÔNG SÀI GÒN ---
  if (input.includes('hầm thủ thiêm') || input.includes('hầm sài gòn') || input.includes('qua hầm')) {
    return pickRandom([
      '🚇 Đi qua Hầm Thủ Thiêm (Sài Gòn) nhớ kỹ: 1. Bật đèn chiếu gần (Cốt). 2. KHÔNG bấm còi. 3. Xe máy đi đúng làn, tốc độ tối đa 40km/h.',
      'Cảnh sát hay bắt lỗi ở cửa hầm lắm đấy! Lỗi phổ biến nhất là quên bật đèn và bấm còi trong hầm. Phạt tiền triệu đấy, không đùa đâu.',
      'Xe máy qua hầm tuyệt đối không được vượt xe khác nhé. Camera phạt nguội trong hầm soi nét lắm!'
    ]);
  }

  // --- 35. PHỐ ĐI BỘ (Hồ Gươm / Nguyễn Huệ) ---
  if (input.includes('phố đi bộ') || input.includes('hồ gươm') || input.includes('cấm xe')) {
    return pickRandom([
      '🚶 Cuối tuần Phố đi bộ Hồ Gươm (Hà Nội) cấm xe từ tối thứ 6 đến hết Chủ nhật. Nhớ xem giờ để tránh đi vào đường cấm bị phạt nhé.',
      'Vào khu vực Phố đi bộ nhớ gửi xe đúng nơi quy định, đừng để xe dưới lòng đường bị Công an phường "bế" xe đi đấy.',
      'Đi chơi phố đi bộ vui vẻ! Nhưng nhớ đừng đua xe hay nẹt pô quanh khu vực này, Cảnh sát cơ động (141) trực nhiều lắm.'
    ]);
  }

  // --- 36. MÙA MƯA NGẬP / THỦY KÍCH (Đặc sản HN/HCM) ---
  if (input.includes('ngập') || input.includes('lội nước') || input.includes('mùa mưa')) {
    return pickRandom([
      '🌧️ "Hà Nội/Sài Gòn phố cũng như sông"! Thấy đường ngập sâu quá bô xe thì đừng cố đi. Chết máy giữa đường là khổ lắm.',
      'Mẹo đi đường ngập: Đi số thấp (số 1, 2), giữ đều ga lớn để nước không tràn vào ống xả. Tuyệt đối không giảm ga đột ngột.',
      'Nếu lỡ bị chết máy do ngập nước: Đừng cố đề máy lại ngay! Dắt bộ tìm chỗ sửa để tháo bu-gi, xả nước ra đã nhé.'
    ]);
  }

  // --- 37. XE ÔM CÔNG NGHỆ (Grab / Be / Gojek) ---
  if (input.includes('grab') || input.includes('xe ôm') || input.includes('book xe')) {
    return pickRandom([
      '📱 Đi xe ôm công nghệ nhớ đội mũ bảo hiểm của tài xế đưa nhé. Không đội là cả 2 cùng bị phạt đấy.',
      'Lên xe nhớ nhắc bác tài đi cẩn thận, đừng vừa lái vừa xem điện thoại. An toàn của mình nằm trong tay họ mà.',
      'Nếu bác tài chạy ẩu hoặc vượt đèn đỏ, bạn có quyền nhắc nhở hoặc đánh giá sao thấp. Đừng im lặng để rước họa vào thân.'
    ]);
  }

  // --- 38. CẢNH SÁT 141 (Đặc sản Hà Nội) ---
  if (input.includes('141') || input.includes('chốt 141') || input.includes('cơ động')) {
    return pickRandom([
      '👮 Chốt 141 (Hà Nội) chuyên bắt tội phạm và vi phạm giao thông. "Cây ngay không sợ chết đứng", cứ đi đúng luật, đội mũ đầy đủ thì 141 vẫy tay chào thôi ^^',
      'Thấy chốt 141 đừng quay đầu bỏ chạy nha! Hành vi quay đầu bỏ chạy bị nghi ngờ là tội phạm, dễ bị trấn áp mạnh tay lắm.',
      '141 làm việc rất nghiêm. Nhớ mang đầy đủ giấy tờ, không mang đồ cấm (dao, kiếm...) trong cốp xe nhé.'
    ]);
  }

  // --- 39. VĂN HÓA CÒI XE (Bấm vô tội vạ) ---
  if (input.includes('còi') || input.includes('bấm còi') || input.includes('tin tin')) {
    return pickRandom([
      '🔊 Ở Việt Nam nhiều người thích bấm còi nhỉ? Nhưng luật cấm bấm còi từ 22h đêm đến 5h sáng trong khu dân cư đấy.',
      'Đèn đỏ còn 3 giây đã bấm còi inh ỏi là hành vi kém văn minh nha. Hãy kiên nhẫn một chút!',
      'Còi chỉ dùng để báo hiệu khi cần thiết. Đừng bấm còi để hối thúc người khác, dễ gây ức chế và xô xát không đáng có.'
    ]);
  }
  // --- 4. TRỪ ĐIỂM BẰNG LÁI (Quy định mới 2025) ---
  if (input.includes('điểm') || input.includes('bằng lái') || input.includes('gplx') || input.includes('phục hồi')) {
    return pickRandom([
      'Luật mới 2025 nè: Mỗi bằng lái có 12 điểm/năm. Vi phạm là bị trừ điểm (2-10 điểm tùy lỗi). Hết điểm là phải thi lại đấy, cẩn thận nha!',
      'Bạn có 12 điểm mỗi năm. Nếu lái ngoan 12 tháng không vi phạm thì điểm tự hồi phục. Còn để bị trừ hết là phải đi học lại luật mới được cấp bằng lại đó.',
      'Cố gắng giữ 12 điểm nhé! Vượt đèn đỏ, không mũ, quá tốc độ... là bị trừ điểm ngay trên hệ thống đấy. Hết điểm là rắc rối to!'
    ]);
  }

  // --- 5. ĐÈN ĐỎ & TÍN HIỆU ---
  if (input.includes('đèn đỏ') || input.includes('vượt đèn') || input.includes('đèn vàng')) {
    return pickRandom([
      '🔴 Đèn đỏ là phải dừng hẳn nha. Đừng cố vượt, vừa nguy hiểm vừa bị phạt tiền + trừ điểm bằng lái đấy.',
      'Thấy đèn vàng là dừng lại đi bạn, cố vượt đèn vàng giờ phạt y chang đèn đỏ. Chậm một giây còn hơn gây tai nạn.',
      'Tuyệt đối không vượt đèn đỏ nhé. Camera phạt nguội ở khắp nơi, giấy phạt về tận nhà lại mất vui!'
    ]);
  }

  // --- 6. MŨ BẢO HIỂM ---
  if (input.includes('mũ') || input.includes('bảo hiểm')) {
    return pickRandom([
      '⛑️ Đi xe máy (kể cả xe điện) là phải đội mũ bảo hiểm cài quai đúng cách nha. Không đội là "hiến máu" cho CSGT đấy ^^',
      'Đội cái mũ vào cho an toàn cái đầu bạn ơi. Không đội mũ vừa bị phạt tiền, vừa bị trừ điểm bằng lái nữa.',
      'Nhớ đội mũ bảo hiểm đạt chuẩn nhé. Mấy cái mũ thời trang mỏng dính không bảo vệ được gì đâu, CSGT vẫn phạt như thường.'
    ]);
  }

  // --- 7. TỐC ĐỘ ---
  if (input.includes('tốc độ') || input.includes('nhanh') || input.includes('chậm')) {
    return pickRandom([
      '🚀 Trong phố đông thì cứ tà tà 40-50km/h thôi. Ra đường trường thì được 60-90km/h tùy biển báo. Chạy nhanh quá camera bắn tốc độ đấy!',
      'Cứ nhìn biển báo mà chạy bạn à. Thường thì trong khu dân cư là 50km/h. Chạy quá tốc độ là lỗi bị trừ điểm nặng nhất đấy.',
      'Nhanh một phút, chậm cả đời! Tuân thủ tốc độ cho an toàn. Từ 2025 vi phạm tốc độ bị trừ điểm bằng lái gắt lắm.'
    ]);
  }

  // --- 8. ĐI NGƯỢC CHIỀU ---
  if (input.includes('ngược chiều')) {
    return pickRandom([
      '⛔ Ôi không! Đừng bao giờ đi ngược chiều. Lỗi này phạt cực nặng và tước bằng lái luôn đấy.',
      'Đi ngược chiều là hành vi "tự sát" đó bạn. Phạt tiền triệu và giam bằng lái ngay lập tức. Đừng dại dột!',
      'Quay đầu là bờ! Đi ngược chiều cực kỳ nguy hiểm cho bạn và người khác. Mức phạt rất cao nhé.'
    ]);
  }

  // --- 9. CAO TỐC ---
  if (input.includes('cao tốc')) {
    return pickRandom([
      '🛣️ Lên cao tốc nhớ: Không đi làn khẩn cấp, không lùi xe, giữ khoảng cách an toàn. Lùi xe trên cao tốc là phạt 17 triệu đấy!',
      'Chạy cao tốc sướng nhưng phải tập trung. Tuyệt đối không được dừng đỗ hay đi vào làn khẩn cấp nếu xe không hỏng nhé.',
      'Cao tốc cấm xe máy (trừ vài nơi đặc biệt). Ô tô lên cao tốc nhớ tuân thủ tốc độ tối thiểu và tối đa nha.'
    ]);
  }
  
  // Giấy tờ xe & VNeID
  if (input.includes('giấy tờ') || input.includes('vneid') || input.includes('mang theo')) {
    return 'Giấy tờ khi lái xe (Luật 2024): \n1. Đăng ký xe\n2. Giấy phép lái xe (GPLX)\n3. Bảo hiểm TNDS bắt buộc\n4. Đăng kiểm (với ô tô)\n📢 MỚI: Bạn có thể xuất trình giấy tờ qua ứng dụng VNeID thay cho bản giấy (nếu đã tích hợp và xác thực). CSGT kiểm tra thông tin trên VNeID có giá trị tương đương bản giấy.';
  }

  // Bảo hiểm xe máy
  if (input.includes('bảo hiểm') || input.includes('tnds')) {
    return 'Bảo hiểm Trách nhiệm dân sự (TNDS) là BẮT BUỘC. Mức phạt không có bảo hiểm:\n• Xe máy: 100.000 - 200.000đ\n• Ô tô: 400.000 - 600.000đ\nCSGT chấp nhận bảo hiểm điện tử (bản file ảnh/app) khi kiểm tra.';
  }
  // Biển số định danh
  if (input.includes('biển số') || input.includes('định danh') || input.includes('biển đẹp')) {
    return 'Quy định biển số định danh:\n• Biển số đi theo người, không đi theo xe. Bán xe phải giữ lại biển số, nộp lại cho cơ quan công an.\n• Mua xe mới được lắp lại biển cũ (trong thời hạn 5 năm từ khi thu hồi).\n• Biển 3-4 số cũ vẫn được lưu thông, nhưng nếu sang tên đổi chủ sẽ chuyển sang biển định danh 5 số.';
  }

  // Biển số xe máy cũ (1 chữ 1 số)
  if (input.includes('biển cũ') || input.includes('hạn sử dụng biển')) {
    return 'Lưu ý quan trọng: Các loại biển số xe máy cũ (loại chỉ có 1 chữ cái và 1 số, ví dụ 29-H1) chỉ được sử dụng đến hết ngày 31/12/2025. Sau thời hạn này phải làm thủ tục đổi sang biển số mới theo quy định.';
  }
  // Lỗi không gương
  if (input.includes('gương') || input.includes('kính chiếu hậu')) {
    return 'Xe máy BẮT BUỘC phải có gương chiếu hậu bên TRÁI. \n⚠️ Mức phạt mới 2025: 400.000 - 600.000đ (tăng gấp 3-4 lần so với trước). \nGương phải có tác dụng phản xạ thực tế, không dùng gương thời trang chỉ để đối phó.';
  }

  // Lỗi đi ngược chiều
  if (input.includes('ngược chiều') || input.includes('đi ngược')) {
    return 'Đi ngược chiều là hành vi cực kỳ nguy hiểm!\n• Xe máy: Phạt 4 - 6 triệu đồng + Tước bằng lái 3-5 tháng.\n• Ô tô: Phạt 6 - 8 triệu đồng + Tước bằng lái 2-4 tháng.\nĐừng vì nhanh một chút mà gây tai nạn cho người khác!';
  }

  // Vượt đèn đỏ
  if (input.includes('vượt đèn') || input.includes('đèn đỏ')) {
    return 'Mức phạt vượt đèn đỏ/đèn vàng:\n• Xe máy: 800k - 1 triệu đồng + Tước bằng 1-3 tháng.\n• Ô tô: 4 - 6 triệu đồng + Tước bằng 1-3 tháng.\nLưu ý: Từ 2025, lỗi này sẽ bị TRỪ ĐIỂM giấy phép lái xe ngay lập tức.';
  }
  // Bật đèn xe
  if (input.includes('bật đèn') || input.includes('đèn xe') || input.includes('trời tối')) {
    return 'Quy định bật đèn xe (Luật 2024):\n• Thời gian bắt buộc: Từ 18:00 hôm trước đến 06:00 hôm sau (sớm hơn 1 tiếng so với luật cũ).\n• Trong đô thị/khu dân cư: Chỉ được dùng đèn Cốt (chiếu gần).\n• Phạt tiền nếu không bật đèn hoặc bật đèn Pha (chiếu xa) trong phố.';
  }

  // Độ bô, còi
  if (input.includes('pô') || input.includes('độ xe') || input.includes('còi')) {
    return 'Lỗi thay đổi kết cấu xe:\n• "Độ" pô, thay đổi hệ thống thải: Phạt nặng và buộc khôi phục nguyên trạng.\n• Bấm còi liên tục, bấm còi hơi trong đô thị: Phạt 400k-600k.\n• Không được dùng còi từ 22h đến 5h sáng trong khu dân cư.';
  }
  // Chở quá số người
  if (input.includes('chở') || input.includes('kẹp 3') || input.includes('bao nhiêu người')) {
    return 'Xe máy được chở tối đa 2 người trong trường hợp:\n1. Chở người bệnh đi cấp cứu.\n2. Áp giải người vi phạm pháp luật.\n3. Chở trẻ em dưới 14 tuổi.\nCòn lại chỉ được chở 1 người ngồi sau. Chở 3 người trở lên sẽ bị phạt và tước bằng lái.';
  }
  
  // Ghế trẻ em trên ô tô
  if ((input.includes('ghế') || input.includes('trẻ')) && input.includes('ô tô')) {
    return 'Quy định mới (Luật 2024): Trẻ em dưới 10 tuổi và chiều cao dưới 1,35m KHÔNG được ngồi cùng hàng ghế với người lái xe (ghế phụ trước), trừ loại xe chỉ có 1 hàng ghế. Phải dùng thiết bị an toàn phù hợp.';
  }

  // Câu hỏi về mũ bảo hiểm
  if (input.includes('mũ') || input.includes('bảo hiểm')) {
    return 'Đội mũ bảo hiểm là bắt buộc khi đi xe máy! Mũ bảo hiểm giảm 69% nguy cơ chấn thương đầu nghiêm trọng. Hãy chọn mũ có tiêu chuẩn chất lượng, đúng size và cài quai đúng cách.';
  }
  
  // Câu hỏi về tốc độ
  if (input.includes('tốc độ') || input.includes('nhanh')) {
    return 'Giới hạn tốc độ trong khu dân cư là 50km/h, đường quốc lộ 60-80km/h, và cao tốc 80-120km/h tùy loại xe. Chạy đúng tốc độ giúp bạn có thời gian phản ứng tốt hơn và tránh tai nạn.';
  }
  
  // Câu hỏi về rượu bia
  if (input.includes('rượu') || input.includes('bia') || input.includes('uống')) {
    return 'TUYỆT ĐỐI KHÔNG lái xe sau khi uống rượu bia! Nồng độ cồn trong máu làm giảm khả năng phản xạ và phán đoán. Luật quy định nồng độ cồn phải bằng 0 khi lái xe. Hãy gọi taxi hoặc để người khác lái xe!';
  }
  
  // Câu hỏi về đèn tín hiệu
  if (input.includes('đèn') || input.includes('tín hiệu') || input.includes('đỏ') || input.includes('xanh')) {
    return 'Đèn giao thông: Đèn ĐỎ - Dừng lại. Đèn VÀNG - Chuẩn bị dừng (chỉ đi qua nếu đã quá gần). Đèn XANH - Được đi nhưng vẫn phải quan sát. Luôn tuân thủ đèn tín hiệu để tránh va chạm!';
  }
  
  // Câu hỏi về điện thoại
  if (input.includes('điện thoại') || input.includes('phone') || input.includes('gọi')) {
    return 'Không sử dụng điện thoại khi lái xe! Mất tập trung 5 giây ở tốc độ 90km/h = đi "mù" 125m. Nếu cần thiết, hãy dừng xe an toàn rồi mới sử dụng điện thoại.';
  }
  
  // Câu hỏi về biển báo
  if (input.includes('biển báo') || input.includes('biển')) {
    return 'Biển báo giao thông gồm 3 loại chính:\n• Biển cấm (tròn, viền đỏ): Cấm làm điều gì đó\n• Biển nguy hiểm (tam giác, viền đỏ): Cảnh báo nguy hiểm\n• Biển hiệu lệnh (tròn, nền xanh): Chỉ dẫn bắt buộc\nLuôn chú ý và tuân thủ biển báo!';
  }
  
  // Câu hỏi về khoảng cách
  if (input.includes('khoảng cách') || input.includes('theo sau')) {
    return 'Giữ khoảng cách an toàn với xe phía trước! Quy tắc 3 giây: Chọn một điểm cố định, đếm 3 giây từ khi xe trước qua điểm đó. Nếu bạn đến trước 3 giây nghĩa là bạn đang đi quá gần.';
  }
  
  // Câu hỏi về đêm
  if (input.includes('đêm') || input.includes('tối')) {
    return 'Lái xe ban đêm cần:\n• Bật đèn chiếu sáng\n• Giảm tốc độ\n• Tăng khoảng cách an toàn\n• Tránh nhìn thẳng vào đèn xe ngược chiều\n• Nghỉ ngơi đủ trước khi lái xe đường dài';
  }
  
  // Câu hỏi về trẻ em
  if (input.includes('trẻ em') || input.includes('em bé') || input.includes('con')) {
    return 'An toàn cho trẻ em:\n• Trẻ dưới 10 tuổi phải ngồi ghế sau\n• Sử dụng ghế ngồi phù hợp với lứa tuổi\n• Luôn thắt dây an toàn\n• Không để trẻ thò tay/đầu ra ngoài cửa sổ\n• Dạy trẻ quy tắc băng qua đường an toàn';
  }
  
  // Câu hỏi về mưa
  if (input.includes('mưa') || input.includes('trời mưa')) {
    return 'Lái xe khi mưa:\n• Giảm tốc độ 20-30%\n• Bật đèn và gạt nước\n• Tăng khoảng cách phanh\n• Tránh vũng nước sâu\n• Cẩn thận với đường trơn trượt\n• Không phanh gấp';
  }

  // Câu hỏi về bảo dưỡng
  if (input.includes('bảo dưỡng') || input.includes('kiểm tra xe')) {
    return 'Kiểm tra xe định kỳ:\n• Phanh: Kiểm tra độ dày má phanh\n• Lốp: Áp suất và độ mòn\n• Đèn: Tất cả đèn hoạt động tốt\n• Dầu máy: Mức và chất lượng\n• Còi, gương chiếu hậu\nXe an toàn = Đi đường an toàn!';
  }

  // Câu hỏi về phạt nguội
  if (input.includes('phạt nguội') || input.includes('phạt')) {
    return 'Phạt nguội là hình thức xử phạt qua camera giám sát giao thông. Các lỗi thường bị phạt:\n• Vượt đèn đỏ: 4-6 triệu đồng\n• Vượt tốc độ: 2-8 triệu đồng\n• Đi sai làn: 1-2 triệu đồng\n• Không đội mũ bảo hiểm: 200-400 nghìn đồng\nLuôn tuân thủ luật để tránh bị phạt!';
  }

  // Lời chào
  if (input.includes('xin chào') || input.includes('chào') || input.includes('hello') || input.includes('hi')) {
    return 'Xin chào! Tôi là trợ lý ảo về An toàn Giao thông Việt Nam. Tôi có thể giúp bạn về luật giao thông, mức phạt vi phạm, và các mẹo lái xe an toàn. Bạn muốn hỏi gì?';
  }
  // --- NHÓM 1: CẤP BÁCH & NGHIÊM TRỌNG ---

  // Tai nạn & Sự cố
  if (input.includes('tai nạn') || input.includes('va chạm') || input.includes('tông xe')) {
    return 'Nếu xảy ra tai nạn:\n1. Dừng xe ngay lập tức, giữ nguyên hiện trường.\n2. Cấp cứu người bị nạn (nếu có).\n3. Báo cho cảnh sát hoặc chính quyền gần nhất.\n4. KHÔNG được bỏ trốn (Bỏ trốn bị phạt 16-18 triệu và tước bằng 5-7 tháng, hoặc truy cứu hình sự).';
  }

  // Nồng độ cồn (Cập nhật 2025)
  if (input.includes('rượu') || input.includes('bia') || input.includes('uống') || input.includes('cồn')) {
    return 'CẤM TUYỆT ĐỐI nồng độ cồn khi lái xe! Từ 2025, ngoài phạt tiền còn bị TRỪ ĐIỂM hoặc TƯỚC bằng:\n• Mức 1 (chưa vượt quá 50mg/100ml máu): Phạt tiền + Trừ điểm bằng lái.\n• Mức 2 (50-80mg/100ml máu): Phạt nặng + Trừ 10 điểm.\n• Mức 3 (>80mg/100ml máu): Phạt kịch khung + Tước bằng lái.\nHãy gọi xe dịch vụ nếu đã uống rượu bia!';
  }

  // --- NHÓM 2: GIẤY TỜ, ĐIỂM SỐ & VNeID (Luật 2025) ---

  // Trừ điểm & Phục hồi điểm
  if (input.includes('phục hồi') || input.includes('lấy lại điểm') || input.includes('về 12')) {
    return 'Cơ chế phục hồi điểm (từ 2025):\n• Nếu chưa bị trừ hết 12 điểm: Sau 12 tháng kể từ ngày bị trừ điểm gần nhất, nếu không vi phạm thêm thì điểm sẽ tự động về lại 12.\n• Nếu bị trừ hết 12 điểm: Phải thi lại kiến thức pháp luật. Đạt yêu cầu mới được cấp lại 12 điểm.';
  }

  if (input.includes('điểm') || input.includes('bằng lái') || input.includes('gplx') || input.includes('trừ điểm')) {
    return 'Quy định mới từ 1/1/2025: Mỗi Giấy phép lái xe có 12 điểm/năm.\n• Vi phạm sẽ bị trừ điểm (2-10 điểm tùy lỗi).\n• Hết 12 điểm: Phải thi lại kiến thức sau 6 tháng mới được cấp lại.\n• Không bị trừ hết trong 12 tháng: Tự động hồi phục về 12 điểm.\nLưu ý: GPLX sẽ chia thành 15 hạng (thêm hạng A, C1, D1, D2...).';
  }

  // Giấy tờ & VNeID
  if (input.includes('giấy tờ') || input.includes('vneid') || input.includes('mang theo') || input.includes('mất bằng')) {
    return 'Giấy tờ khi lái xe (Luật 2024): \n1. Đăng ký xe\n2. Giấy phép lái xe (GPLX)\n3. Bảo hiểm TNDS bắt buộc\n4. Đăng kiểm (với ô tô)\n📢 MỚI: Bạn có thể xuất trình giấy tờ qua ứng dụng VNeID thay cho bản giấy (nếu đã tích hợp). Nếu mất bằng lái, có thể dùng VNeID hoặc làm thủ tục cấp lại (cấm lái xe trong thời gian chờ cấp mới).';
  }

  // Biển số định danh
  if (input.includes('biển số') || input.includes('định danh') || input.includes('biển cũ')) {
    return 'Biển số định danh:\n• Biển số đi theo người. Bán xe phải giữ lại biển, nộp lại cho công an.\n• Biển 3-4 số cũ vẫn lưu thông, nhưng khi sang tên sẽ đổi sang biển định danh 5 số.\n⚠️ Lưu ý: Biển xe máy cũ (loại 1 chữ 1 số, vd: 29-H1) chỉ dùng đến hết 31/12/2025.';
  }

  // --- NHÓM 3: QUY TẮC LÁI XE CỤ THỂ ---

  // Cao tốc (Cần check trước vì "tốc độ" cũng có trong này)
  if (input.includes('cao tốc') || input.includes('làn khẩn cấp')) {
    return 'Quy định lái xe trên Cao tốc:\n• KHÔNG được đi vào làn khẩn cấp (trừ khi xe hỏng).\n• KHÔNG lùi xe, quay đầu (Phạt 16-18 triệu + Tước bằng).\n• Tuân thủ khoảng cách an toàn ghi trên biển (0m, 50m, 100m).\n• Chỉ dừng đỗ tại nơi quy định.';
  }

  // Rẽ phải đèn đỏ (Check trước "Đèn đỏ")
  if ((input.includes('rẽ') && input.includes('đỏ')) || input.includes('được rẽ không')) {
    return 'Lưu ý: Gặp đèn đỏ, bạn KHÔNG ĐƯỢC PHÉP rẽ phải, TRỪ KHI:\n1. Có biển báo phụ "Được phép rẽ phải".\n2. Có đèn tín hiệu mũi tên xanh.\n3. Có vạch mắt võng và tiểu đảo dẫn hướng.\nNếu không có các dấu hiệu trên, rẽ phải là vi phạm vượt đèn đỏ!';
  }

  // Đèn tín hiệu chung
  if (input.includes('đèn') || input.includes('tín hiệu') || input.includes('đỏ') || input.includes('xanh')) {
    return 'Đèn giao thông:\n• Đèn ĐỎ: Dừng lại hoàn toàn.\n• Đèn VÀNG: Dừng lại trước vạch (trừ khi đã đi quá vạch). Vượt đèn vàng phạt như vượt đèn đỏ.\n• Đèn XANH: Được phép đi.\nLưu ý: Vượt đèn đỏ/vàng sẽ bị trừ điểm bằng lái từ năm 2025.';
  }

  // Xi nhan & Chuyển hướng
  if (input.includes('xi nhan') || input.includes('chuyển hướng') || input.includes('quên xi nhan')) {
    return 'Bắt buộc bật xi nhan khi:\n1. Chuyển làn đường.\n2. Rẽ trái/phải.\n3. Quay đầu xe.\n4. Xuất phát hoặc dừng xe vào lề.\n⚠️ Mẹo: Bật xi nhan trước 30-50m. Tắt quá muộn hoặc không bật đều bị phạt tiền.';
  }

  // Vượt xe & Đi ngược chiều
  if (input.includes('ngược chiều') || input.includes('vượt')) {
    return '• Đi ngược chiều: Phạt rất nặng (Xe máy 4-6tr, Ô tô 6-8tr) + Tước bằng.\n• Vượt xe: Chỉ vượt bên trái (trừ vài trường hợp đặc biệt). Phải có tín hiệu và quan sát an toàn. Cấm vượt nơi đường vòng, đầu dốc, cầu hẹp.';
  }

  // Nhường đường (Xe ưu tiên/Người đi bộ)
  if (input.includes('ưu tiên') || input.includes('cứu thương') || input.includes('đi bộ') || input.includes('nhường')) {
    return '• Xe ưu tiên (Cứu thương/hỏa/cảnh sát): Bắt buộc giảm tốc, đi sát lề phải, nhường đường. Cản trở có thể bị xử lý hình sự.\n• Người đi bộ: Tại vạch kẻ đường, lái xe PHẢI quan sát, giảm tốc và nhường đường cho người đi bộ.';
  }

  // --- NHÓM 4: TRẺ EM & NGƯỜI NGỒI TRÊN XE ---

  // Trẻ em (Luật 2024)
  if (input.includes('trẻ em') || input.includes('em bé') || input.includes('con') || input.includes('ghế')) {
    return 'Quy định mới về an toàn trẻ em (Luật 2024):\n• Ô tô: Trẻ dưới 10 tuổi và cao dưới 1.35m KHÔNG được ngồi ghế trước (cạnh tài xế). Bắt buộc dùng thiết bị an toàn phù hợp.\n• Xe máy: Chỉ được chở 1 trẻ em. Trẻ trên 6 tuổi bắt buộc đội mũ bảo hiểm.';
  }

  // Chở quá số người
  if (input.includes('chở') || input.includes('kẹp 3') || input.includes('bao nhiêu người')) {
    return 'Xe máy chỉ được chở tối đa 1 người ngồi sau. Được chở 2 người trong trường hợp:\n1. Chở người bệnh đi cấp cứu.\n2. Áp giải người vi phạm.\n3. Chở trẻ em dưới 14 tuổi.\nChở 3 người lớn trở lên sẽ bị phạt và tước bằng lái.';
  }

  // --- NHÓM 5: TRANG BỊ & HÀNH VI CẤM ---

  // Mũ bảo hiểm
  if (input.includes('mũ') || input.includes('bảo hiểm')) {
    return 'Đội mũ bảo hiểm đạt chuẩn là bắt buộc với cả người lái và người ngồi sau (kể cả xe đạp điện). Không đội mũ sẽ bị phạt tiền và TRỪ ĐIỂM bằng lái.';
  }

  // Gương chiếu hậu
  if (input.includes('gương') || input.includes('kính')) {
    return 'Xe máy BẮT BUỘC phải có gương chiếu hậu bên TRÁI. \n⚠️ Mức phạt mới 2025: 400.000 - 600.000đ (tăng gấp 3-4 lần). Gương phải có tác dụng phản xạ thực tế, không dùng gương thời trang đối phó.';
  }

  // Điện thoại & Ô dù
  if (input.includes('điện thoại') || input.includes('phone') || input.includes('ô') || input.includes('dù')) {
    return 'Hành vi CẤM:\n• Dùng điện thoại cầm tay khi lái xe (cả ô tô & xe máy): Phạt tiền + Trừ điểm.\n• Dùng ô (dù) khi đi xe máy: Rất nguy hiểm, dễ gây lật xe khi có gió.';
  }

  // Độ xe (Pô, còi)
  if (input.includes('pô') || input.includes('độ xe') || input.includes('còi')) {
    return '• Độ pô, thay đổi kết cấu: Phạt nặng, buộc khôi phục nguyên trạng.\n• Còi: Không được bấm còi từ 22h-5h sáng trong khu dân cư. Cấm còi hơi trong đô thị.';
  }

  // Kéo đẩy & Hàng cồng kềnh
  if (input.includes('đẩy xe') || input.includes('kéo xe') || input.includes('cồng kềnh') || input.includes('chở hàng')) {
    return '• Cấm xe máy/ô tô đẩy, kéo xe khác (trừ xe cứu hộ). Dùng chân đẩy xe bị phạt tiền.\n• Hàng cồng kềnh: Bề rộng giá đèo hàng mỗi bên không quá 0.3m, phía sau không quá 0.5m, chiều cao không quá 1.5m.';
  }

  // --- NHÓM 6: THÔNG SỐ KỸ THUẬT (Tốc độ, Đèn, Thời tiết) ---

  // Tốc độ
  if (input.includes('tốc độ') || input.includes('nhanh')) {
    return 'Giới hạn tốc độ phổ biến:\n• Khu dân cư: 50km/h (đường đôi), 40km/h (đường 2 chiều).\n• Đường ngoài khu dân cư: 60-90km/h tùy loại đường.\n• Cao tốc: Theo biển báo (tối đa 120km/h).\nVi phạm tốc độ từ 2025 sẽ bị trừ điểm GPLX!';
  }

  // Đi đêm & Đèn xe
  if (input.includes('đêm') || input.includes('tối') || input.includes('bật đèn')) {
    return '• Bật đèn xe: Bắt buộc từ 18:00 đến 06:00 hôm sau (Luật 2024).\n• Trong phố: Chỉ dùng đèn Cốt (chiếu gần).\n• Ngoài phố: Được dùng đèn Pha, nhưng phải chuyển Cốt khi gặp xe ngược chiều.';
  }

  // Trời mưa
  if (input.includes('mưa') || input.includes('trời mưa')) {
    return 'Lái xe khi mưa:\n• Giảm tốc độ 20-30%.\n• Bật đèn chiếu sáng và đèn sương mù.\n• Tăng khoảng cách an toàn gấp đôi.\n• Tránh phanh gấp và đi vào vũng nước sâu.';
  }

  // Khoảng cách
  if (input.includes('khoảng cách') || input.includes('theo sau')) {
    return 'Giữ khoảng cách an toàn (Quy tắc 3 giây):\n• 60km/h: 35m\n• 60-80km/h: 55m\n• 80-100km/h: 70m\n• 100-120km/h: 100m\nTuân thủ để tránh va chạm dồn toa!';
  }

  // --- NHÓM 7: HÀNH CHÍNH & MẶC ĐỊNH ---

  // Bảo dưỡng & Đăng kiểm
  if (input.includes('bảo dưỡng') || input.includes('đăng kiểm')) {
    return '• Xe máy: Kiểm tra lốp, phanh, định kỳ kiểm tra khí thải (mới).\n• Ô tô: Tuân thủ chu kỳ đăng kiểm. Xe mới miễn đăng kiểm lần đầu. Được dùng bản giấy tờ xe trên VNeID.';
  }
  // --- 21. QUAY PHIM / GIÁM SÁT CSGT (Chủ đề nhạy cảm) ---
  if (input.includes('quay phim') || input.includes('ghi âm') || input.includes('giám sát') || input.includes('chuyên đề')) {
    return pickRandom([
      '🎥 Bạn có quyền giám sát (quay phim/chụp ảnh) CSGT đang làm nhiệm vụ, NHƯNG: Phải đứng ở vị trí an toàn, không gây cản trở và không được dí máy vào mặt người ta nha.',
      'Về "Chuyên đề": Người dân được quyền biết thông qua Cổng thông tin điện tử hoặc niêm yết tại trụ sở. Bạn KHÔNG có quyền đòi CSGT phải xuất trình văn bản/chuyên đề giấy ngay tại chỗ đâu nhé.',
      'Giám sát là quyền của dân, nhưng phải văn minh. Quay phim xong tung lên mạng cắt ghép sai sự thật là bị phạt theo Luật An ninh mạng đấy.'
    ]);
  }

  // --- 22. ĐIỂM MÙ XE TẢI / CONTAINER (Mẹo sinh tồn) ---
  if (input.includes('xe công') || input.includes('container') || input.includes('xe tải') || input.includes('điểm mù')) {
    return pickRandom([
      '🚚 "Tránh voi chẳng xấu mặt nào"! Gặp xe Container thì né xa ra. Điểm mù của nó nằm ở: Ngay trước đầu xe, ngay sau đuôi xe và hai bên hông (đặc biệt là bên phải).',
      'Đừng bao giờ tạt đầu xe tải lớn! Tài xế ngồi trên cao KHÔNG nhìn thấy bạn ngay mũi xe đâu. Rất nhiều vụ tai nạn thương tâm vì lỗi này rồi.',
      'Mẹo sống còn: Nếu bạn không nhìn thấy gương chiếu hậu của tài xế xe tải, nghĩa là tài xế cũng KHÔNG nhìn thấy bạn. Hãy phanh lại và nhường đường.'
    ]);
  }

  // --- 23. THAY ĐỔI MÀU SƠN / DÁN DECAL ---
  if (input.includes('đổi màu') || input.includes('dán decal') || input.includes('dán xe') || input.includes('sơn xe')) {
    return pickRandom([
      '🎨 Thích đổi màu xe cho hợp phong thủy? Nhớ đi làm thủ tục "Đổi lại Giấy đăng ký xe" trước nhé. Tự ý sơn đổi màu khác với cavet là bị phạt đấy.',
      'Dán tem trùm (decal đổi màu) mà làm thay đổi màu sắc ghi trong Đăng ký xe là vi phạm nha (Phạt 100k-200k với xe máy, 2tr-4tr với ô tô).',
      'Dán tem trang trí nhỏ thì vô tư. Nhưng dán kín mít đổi từ Đỏ sang Đen là "tới công chuyện" với mấy chú CSGT liền ^^.'
    ]);
  }

  // --- 24. BẢO HIỂM XE MÁY (Bắt buộc vs Tự nguyện) ---
  if (input.includes('bảo hiểm tự nguyện') || input.includes('bảo hiểm bắt buộc') || input.includes('mua bảo hiểm')) {
    return pickRandom([
      '📄 CSGT chỉ kiểm tra "Bảo hiểm Trách nhiệm dân sự BẮT BUỘC" (cái tờ màu vàng/nâu ấy). Còn bảo hiểm tự nguyện (người ngồi trên xe) thì có hay không cũng không bị phạt.',
      'Đừng mua nhầm! Mấy cái bảo hiểm 10k/20k bán lề đường thường là Tự nguyện. Cái bạn cần để không bị phạt là Bảo hiểm Bắt buộc (khoảng 60k/năm).',
      'Giờ dùng Bảo hiểm điện tử trên app được rồi, không cần kè kè tờ giấy nữa. Tiện lợi lắm!'
    ]);
  }

  // --- 25. VƯỢT ĐÈN VÀNG (Hiểu lầm tai hại) ---
  if (input.includes('đèn vàng') || input.includes('vượt vàng')) {
    return pickRandom([
      '⚠️ Đèn vàng không có nghĩa là "Đi nhanh lên", mà là "Dừng lại"! Nếu chưa đi qua vạch dừng mà đèn chuyển vàng thì phải dừng lại. Cố vượt phạt y như vượt đèn đỏ.',
      'Trừ khi bạn đã đi quá vạch dừng mới bật đèn vàng thì được đi tiếp. Còn thấy đèn vàng từ xa mà cố rướn ga là lỗi vượt đèn tín hiệu nhé.',
      'Nhiều người hay tranh cãi lỗi này. Tốt nhất thấy đèn xanh còn 2-3 giây thì giảm ga chuẩn bị dừng, đừng cố "ăn thua" làm gì.'
    ]);
  }

  // --- 26. KÉO XE / ĐẨY XE KHÁC ---
  if (input.includes('kéo xe') || input.includes('đẩy xe') || input.includes('hết xăng')) {
    return pickRandom([
      '🚫 Xe máy đẩy xe máy: Hình ảnh đẹp về tình bạn nhưng xấu về luật pháp ^^. Phạt 400k-600k đấy nhé. Gọi cứu hộ hoặc mua xăng về đổ thôi.',
      'Tuyệt đối không được dùng xe này đẩy/kéo xe kia (trừ xe kéo chuyên dụng). Hành vi này cực dễ gây ngã xe dây chuyền.',
      'Thấy ai hết xăng thì giúp mua xăng hoặc gọi thợ, đừng dùng chân đẩy nha. Nguy hiểm cho cả 2 xe và người đi đường khác.'
    ]);
  }

  // --- 27. XE BÁN TẢI (Pickup) ---
  if (input.includes('bán tải') || input.includes('pickup') || input.includes('niên hạn')) {
    return pickRandom([
      '🛻 Xe bán tải (Pickup) khi tham gia giao thông được coi là xe con (đi vào làn xe con, không bị cấm giờ như xe tải).',
      'Lưu ý: Xe bán tải có niên hạn sử dụng là 25 năm (không như xe con là vô thời hạn). Hết 25 năm là phải "nghỉ hưu" đấy.',
      'Đi bán tải nhớ chú ý biển báo: Nếu biển cấm xe tải có ghi trọng lượng cụ thể, cần xem xe mình có vượt quá khối lượng chuyên chở không nhé.'
    ]);
  }

  // --- 28. ĐI XE DƯỚI TRỜI MƯA NGẬP (Thủy kích) ---
  if (input.includes('ngập nước') || input.includes('lội nước') || input.includes('thủy kích')) {
    return pickRandom([
      '🌊 Đường ngập quá nửa bánh xe thì đừng cố lội! Nước vào máy là hỏng biên, vỡ lốc máy (thủy kích), sửa tốn cả chục triệu/trăm triệu đấy.',
      'Đi qua vùng ngập: Về số thấp (số 1, 2), giữ đều ga, không rà phanh. Tuyệt đối không được giảm ga đột ngột kẻo nước hút ngược vào ống pô.',
      'Nếu xe bị chết máy giữa dòng nước: TUYỆT ĐỐI KHÔNG ĐƯỢC ĐỀ LẠI. Gọi cứu hộ ngay. Cố đề nổ lúc này là "khai tử" cái động cơ luôn.'
    ]);
  }

  // --- 29. BẰNG LÁI HẾT HẠN ---
  if (input.includes('hết hạn') || input.includes('quá hạn')) {
    return pickRandom([
      '📅 Kiểm tra hạn bằng lái ngay đi! Quá hạn dưới 3 tháng phạt nhẹ. Quá hạn từ 3 tháng - 1 năm là phải thi lại Lý thuyết đấy.',
      'Nếu để quá hạn trên 1 năm: Chia buồn, bạn phải thi lại toàn bộ cả Lý thuyết và Thực hành như người mới. Nhớ đi đổi bằng sớm nha!',
      'Bằng lái xe máy (A1, A2, A) thì không có thời hạn (vô thời hạn). Chỉ có bằng ô tô (B, C, D...) mới phải lo vụ hết hạn thôi.'
    ]);
  }

  // --- 30. NÉM GẠCH ĐÁ / RẢI ĐINH ---
  if (input.includes('ném đá') || input.includes('rải đinh') || input.includes('đinh tặc')) {
    return pickRandom([
      '🔨 Rải đinh là tội ác! Hành vi này có thể bị phạt tù từ 30 triệu đến 100 triệu hoặc phạt tù tới 3 năm. Nếu gây tai nạn chết người thì tù mọt gông.',
      'Ném gạch đá vào xe đang chạy (đặc biệt là tàu hỏa, ô tô cao tốc) là hành vi cực kỳ nguy hiểm và bị xử lý hình sự.',
      'Gặp đinh tặc? Hãy báo ngay cho cơ quan công an hoặc các nhóm hiệp sĩ. Đừng im lặng!'
    ]);
  }
  // Phạt nguội
  if (input.includes('phạt nguội') || input.includes('tra cứu phạt')) {
    return 'Phạt nguội:\n• Kiểm tra trên web Cục CSGT.\n• Không nộp phạt sẽ bị chặn đăng kiểm.\n• Từ 2025, điểm GPLX sẽ bị trừ trên hệ thống ngay khi có quyết định xử phạt.';
  }

  // Lời chào
  if (input.includes('xin chào') || input.includes('chào') || input.includes('hello') || input.includes('hi')) {
    return 'Xin chào! Tôi là trợ lý AI về Luật Giao thông 2025 (hiệu lực 1/1/2025). Tôi có thể tư vấn về:\n• Quy định trừ điểm bằng lái (Mới)\n• Luật cao tốc & Vượt xe\n• Mức phạt nồng độ cồn\n• Biển số định danh & VNeID\nBạn cần hỗ trợ gì?';
  }
  // Quy tắc Dừng đỗ xe
  if (input.includes('dừng xe') || input.includes('đỗ xe') || input.includes('đậu xe')) {
    return 'Quy định Dừng/Đỗ xe:\n• Cấm dừng đỗ: Trên cầu, gầm cầu, miệng cống, hầm đường bộ, điểm đón buýt, nơi đường cong/dốc bị che khuất.\n• Đỗ xe phố: Phải đỗ sát lề phải (bánh xe không cách lề quá 0.25m).\n• Đỗ xe trên hè phố: Chỉ được đỗ ở nơi có biển báo cho phép.';
  }

  // Quy tắc đi Vòng xuyến (Bùng binh)
  if (input.includes('vòng xuyến') || input.includes('bùng binh')) {
    return 'Quy tắc nhường đường tại vòng xuyến:\n• Có biển báo đi theo vòng xuyến: Nhường đường cho xe đến từ bên TRÁI.\n• Không có biển báo: Nhường đường cho xe đến từ bên PHẢI.\n• Luôn giảm tốc độ khi vào giao lộ.';
  }

  // Lỗi "Xe không chính chủ"
  if (input.includes('chính chủ') || input.includes('sang tên') || input.includes('mượn xe')) {
    return 'Lỗi "xe không chính chủ" chỉ bị phạt trong 2 trường hợp:\n1. Khi đi làm thủ tục sang tên (quá hạn 30 ngày).\n2. Khi cơ quan chức năng điều tra vụ tai nạn giao thông.\nCSGT KHÔNG xử phạt lỗi này khi kiểm tra hành chính thông thường trên đường. Bạn được phép mượn xe người thân/bạn bè đi lại bình thường.';
  }

  // Quy định về Biển số Vàng/Xanh/Đỏ
  if (input.includes('biển vàng') || input.includes('biển xanh') || input.includes('biển đỏ')) {
    return 'Ý nghĩa màu biển số:\n• Biển VÀNG: Xe kinh doanh vận tải (Taxi, xe công nghệ, xe tải, xe khách).\n• Biển XANH: Xe của cơ quan Nhà nước.\n• Biển ĐỎ: Xe quân sự.\n• Biển TRẮNG: Xe cá nhân/doanh nghiệp thông thường.';
  }

  // Hành vi Mở cửa xe ô tô (Nguy hiểm)
  if (input.includes('mở cửa') || input.includes('bất cẩn')) {
    return 'Mở cửa xe gây tai nạn là hành vi rất nghiêm trọng:\n• Phạt tiền lái xe/người ngồi trên xe nếu mở cửa không quan sát.\n• Nếu gây tai nạn chết người hoặc thương tích nặng: Có thể bị truy cứu trách nhiệm hình sự.\n⚠️ Quy tắc: Quan sát kỹ gương chiếu hậu, hé mở cánh cửa, thấy an toàn mới mở dứt khoát.';
  }

  // Quy định về Xe đạp điện / Xe máy điện
  if (input.includes('xe đạp điện') || input.includes('máy điện')) {
    return 'Phân biệt để tránh phạt:\n• Xe máy điện (công suất >4kW hoặc >50km/h): Phải Đăng ký biển số + Đội mũ bảo hiểm + Có bằng lái hạng A (theo luật mới).\n• Xe đạp điện (có bàn đạp, <25km/h): Không cần biển số, không cần bằng lái, nhưng VẪN PHẢI đội mũ bảo hiểm.';
  }

  // Quy định về Đèn pha/Cốt (Chi tiết hơn)
  if (input.includes('đèn pha') || input.includes('đèn cốt') || input.includes('chói mắt')) {
    return 'Quy định sử dụng đèn:\n• Trong đô thị/khu đông dân cư: BẮT BUỘC dùng đèn Cốt (chiếu gần). Bật Pha bị phạt 800k-1tr (xe máy) hoặc 4-6tr (ô tô).\n• Nghiêm cấm lắp thêm đèn LED/đèn trợ sáng sai thiết kế gây chói mắt người đối diện.';
  }
  // Quy tắc đi trong Hầm đường bộ
  if (input.includes('hầm') || input.includes('chui hầm')) {
    return 'Lưu ý đặc biệt khi đi trong Hầm đường bộ:\n• BẮT BUỘC bật đèn chiếu sáng (kể cả ban ngày).\n• CẤM: Quay đầu, lùi xe, dừng đỗ trái phép trong hầm.\n• Xe máy, xe thô sơ phải đi đúng làn đường quy định.\nVi phạm trong hầm phạt rất nặng vì nguy cơ tai nạn thảm khốc cao.';
  }

  // Thứ tự ưu tiên Hiệu lệnh (CSGT > Đèn > Biển)
  if (input.includes('hiệu lệnh') || input.includes('cảnh sát') || input.includes('csgt')) {
    return 'Thứ tự tuân thủ (từ cao xuống thấp):\n1. Hiệu lệnh của Cảnh sát giao thông (Cao nhất).\n2. Đèn tín hiệu.\n3. Biển báo hiệu.\n4. Vạch kẻ đường.\nVí dụ: Nếu đèn Đỏ nhưng CSGT vẫy tay cho đi, bạn PHẢI đi theo hiệu lệnh của CSGT.';
  }

  // Lỗi Sai làn đường
  if (input.includes('sai làn') || input.includes('lấn làn') || input.includes('làn đường')) {
    return 'Phân biệt lỗi Làn đường:\n• "Sai làn" (đi vào làn phương tiện khác): Phạt nặng (Xe máy 4-6 triệu, Ô tô 10-12 triệu) + Tước bằng lái.\n• "Không tuân thủ vạch kẻ đường" (đè vạch, chuyển hướng sai vạch): Phạt nhẹ hơn (200k-400k).\nHãy quan sát biển báo R.412 (Làn đường dành riêng) để đi đúng.';
  }

  // Hạng Giấy phép lái xe mới (Luật 2024 - Hiệu lực 2025)
  if (input.includes('hạng a1') || input.includes('hạng a') || input.includes('bằng lái mới')) {
    return 'Thay đổi hạng bằng lái xe máy từ 2025:\n• Hạng A1: Chỉ lái xe đến 125cc hoặc xe điện đến 11kW (trước đây là 175cc).\n• Hạng A: Lái TẤT CẢ các loại xe máy (trên 125cc), thay thế cho hạng A2 cũ.\n⚠️ Bằng lái cũ đã cấp trước 2025 vẫn có giá trị sử dụng bình thường, không bắt buộc phải đổi.';
  }

  // Quy định Quay đầu xe
  if (input.includes('quay đầu') || input.includes('quay xe')) {
    return 'Cấm quay đầu xe tại:\n• Phần đường dành cho người đi bộ.\n• Trên cầu, đầu cầu, gầm cầu vượt, trong hầm.\n• Đường cao tốc.\n• Nơi có biển cấm quay đầu (hoặc cấm rẽ trái thì thường cũng cấm quay đầu theo biển cũ, nhưng biển mới R.123a chỉ cấm rẽ trái thì ĐƯỢC quay đầu).';
  }
  // Phân biệt Vạch kẻ đường (Vàng vs Trắng)
  if (input.includes('vạch kẻ') || input.includes('vạch vàng') || input.includes('vạch trắng') || input.includes('đè vạch')) {
    return 'Cách nhớ vạch kẻ đường:\n• Vạch VÀNG: Phân chia 2 chiều xe chạy ngược nhau (Tim đường).\n• Vạch TRẮNG: Phân chia các làn xe chạy cùng chiều.\n• Nét ĐỨT: Được phép đè vạch, lấn làn khi cần thiết.\n• Nét LIỀN: CẤM đè vạch, CẤM lấn làn (Vi phạm bị phạt tiền).';
  }

  // Quy định thắt Dây an toàn (Seatbelt)
  if (input.includes('dây an toàn') || input.includes('thắt dây') || input.includes('ngồi sau')) {
    return 'Quy định thắt dây an toàn:\n• BẮT BUỘC thắt dây an toàn tại TẤT CẢ các vị trí có trang bị dây (kể cả ghế sau).\n• Nếu xe có dây mà người ngồi (tài xế hoặc hành khách) không thắt: Phạt 800k - 1 triệu đồng/người.\n• An toàn là trên hết, hãy nhắc người thân thắt dây khi lên xe!';
  }

  // Thay đổi Hạng bằng lái Ô tô (B, C) từ 2025
  if (input.includes('hạng b') || input.includes('bằng b1') || input.includes('bằng b2') || input.includes('hạng c')) {
    return 'Thay đổi hạng bằng lái ô tô (Luật 2024):\n• Hạng B (gộp B1 và B2 cũ): Cấp cho người lái xe ô tô chở người đến 8 chỗ, xe tải đến 3,5 tấn. (Được phép kinh doanh vận tải hoặc không).\n• Hạng C1: Xe tải từ 3,5 tấn đến 7,5 tấn.\n• Hạng C: Xe tải trên 7,5 tấn.\n⚠️ Bằng B1 số tự động cũ vẫn được dùng đến khi hết hạn ghi trên bằng.';
  }

  // Thời gian làm việc của tài xế (Chống ngủ gật)
  if (input.includes('thời gian lái') || input.includes('lái liên tục') || input.includes('buồn ngủ')) {
    return 'Quy định thời gian lái xe (để đảm bảo tỉnh táo):\n• Không lái xe quá 10 tiếng/ngày.\n• Không lái xe liên tục quá 4 tiếng (phải nghỉ ít nhất 15 phút).\n• Quy định mới 2024: Vào ban đêm (22h-6h), không được lái liên tục quá 3 tiếng.\nVi phạm sẽ bị phạt nặng đối với xe kinh doanh vận tải.';
  }

  // Sử dụng Đèn khẩn cấp (Hazard/Đèn chớp)
  if (input.includes('đèn khẩn cấp') || input.includes('đèn hazard') || input.includes('đèn chớp') || input.includes('đèn sự cố')) {
    return 'Khi nào dùng đèn khẩn cấp (hình tam giác đỏ)?\n• Khi xe gặp sự cố, hỏng hóc phải đỗ trên đường.\n• Khi lái xe trong tình trạng khẩn cấp, nguy hiểm.\n❌ KHÔNG dùng đèn khẩn cấp khi: Đi qua vòng xuyến, đi thẳng qua ngã tư (gây hiểu nhầm), hoặc khi trời mưa nhỏ (gây lóa mắt xe sau).';
  }

  // Thứ tự Xe ưu tiên (Chi tiết)
  if (input.includes('thứ tự ưu tiên') || input.includes('xe nào đi trước')) {
    return 'Thứ tự quyền ưu tiên (từ cao xuống thấp):\n1. Xe chữa cháy đi làm nhiệm vụ.\n2. Xe quân sự, xe công an đi làm nhiệm vụ.\n3. Xe cứu thương đang cấp cứu.\n4. Xe hộ đê, xe khắc phục thiên tai.\n5. Đoàn xe tang.\n(Lưu ý: Xe cứu hỏa là ưu tiên số 1, cao hơn cả xe Cảnh sát hay Cứu thương).';
  }

  // Quy định về Bình cứu hỏa trên xe
  if (input.includes('bình cứu hỏa') || input.includes('chữa cháy')) {
    return 'Quy định trang bị bình chữa cháy:\n• Xe ô tô trên 9 chỗ ngồi, xe tải, xe khách: BẮT BUỘC phải có bình chữa cháy.\n• Xe ô tô con (4-7 chỗ): KHÔNG bắt buộc (tự nguyện trang bị để an toàn).\nLưu ý: Không để bình cứu hỏa nơi có ánh nắng trực tiếp hoặc nhiệt độ cao (dễ nổ).';
  }

  // Lỗi đi xe dàn hàng ngang
  if (input.includes('hàng ngang') || input.includes('dàn hàng') || input.includes('đi song song')) {
    return 'Đi xe dàn hàng ngang là hành vi cấm:\n• Xe máy: Dàn hàng ngang từ 3 xe trở lên là vi phạm (Phạt 100k-200k).\n• Xe đạp: Dàn hàng ngang từ 2 xe trở lên là vi phạm.\n• Gây cản trở giao thông và rất nguy hiểm.';
  }
  // Lỗi Vượt phải
  if (input.includes('vượt phải') || input.includes('bên phải')) {
    return 'Vượt phải là hành vi CẤM, trừ 3 trường hợp được phép:\n1. Xe phía trước đang có tín hiệu rẽ trái hoặc đang rẽ trái.\n2. Xe điện (tram) đang chạy giữa đường.\n3. Xe chuyên dùng đang làm việc trên đường.\n(Lưu ý: Nếu đường có nhiều làn, bạn đi ở làn bên phải nhanh hơn làn bên trái thì gọi là "xe chạy nhanh hơn", không phải lỗi vượt phải).';
  }

  // Văn hóa nhường đường cho xe buýt/xe công cộng
  if (input.includes('buýt') || input.includes('bus') || input.includes('trạm dừng')) {
    return 'Khi thấy xe buýt ra/vào điểm dừng đón trả khách:\n• Bạn phải giảm tốc độ và nhường đường.\n• Không được lấn vào làn dành riêng cho xe buýt nhanh (BRT), vi phạm sẽ bị phạt nguội.';
  }

  // Sử dụng còi xe đúng cách
  if (input.includes('bấm còi') || input.includes('tiếng còi')) {
    return 'Văn hóa dùng còi:\n• Không bấm còi liên tục, gây ồn ào.\n• CẤM bấm còi từ 22h đêm đến 5h sáng trong khu đô thị, khu dân cư (chỉ được dùng đèn nháy/pass để báo hiệu).\n• Sử dụng còi có âm lượng quá lớn hoặc còi hơi không đúng quy định sẽ bị phạt.';
  }
  // --- 12. KHU VỰC TRƯỜNG HỌC (Luật 2025 nhấn mạnh) ---
  if (input.includes('trường học') || input.includes('cổng trường') || input.includes('học sinh')) {
    return pickRandom([
      '🏫 Đi qua cổng trường học nhớ giảm tốc độ ngay nhé (thường là dưới 30km/h). Trẻ con hay chạy nhảy bất ngờ lắm.',
      'Khu vực trường học là nơi đặc biệt cần chú ý. Luật mới quy định ưu tiên tuyệt đối cho học sinh, bạn nhớ nhường đường và đi chậm thôi.',
      'Thấy biển báo "Trường học" là phải rà phanh ngay. An toàn cho các bé là trên hết!'
    ]);
  }

  // --- 13. CHỞ THÚ CƯNG / ĐỘNG VẬT ---
  if (input.includes('chở chó') || input.includes('chở mèo') || input.includes('thú cưng') || input.includes('động vật')) {
    return pickRandom([
      '🐶 Chở "boss" đi chơi nhớ cẩn thận nha! Không để thú cưng đứng trên yên xe gây mất thăng bằng hoặc che khuất tầm nhìn.',
      'Luật không cấm chở thú cưng, nhưng nếu để nó chạy nhảy lung tung gây tai nạn là bạn chịu đủ đấy. Nên dùng lồng hoặc dây đai an toàn.',
      'Yêu động vật là tốt, nhưng đừng vừa lái xe vừa ôm ấp vuốt ve em nó nhé. Mất tập trung 1 giây là nguy hiểm lắm.'
    ]);
  }

  // --- 14. VĂN HÓA ĐÁ ĐÈN (Nháy pha) ---
  if (input.includes('đá đèn') || input.includes('nháy pha') || input.includes('nháy đèn')) {
    return pickRandom([
      '💡 Đá đèn (nháy pha) thường để xin vượt hoặc cảnh báo xe ngược chiều. Nhưng đừng lạm dụng gây chói mắt người ta nha!',
      'Gặp xe ngược chiều lấn làn thì nháy pha nhẹ cái để nhắc nhở thôi. Đừng bật pha rọi thẳng vào mặt họ, dễ gây ức chế và tai nạn lắm.',
      'Muốn xin vượt? Xi nhan trái + nháy pha nhẹ 1-2 cái là lịch sự nhất. Đừng còi inh ỏi hay dí sát đuôi xe trước nhé.'
    ]);
  }

  // --- 15. ĐỖ XE CHẮN CỬA / NGÕ ---
  if (input.includes('chắn cửa') || input.includes('chắn ngõ') || input.includes('đỗ trước nhà')) {
    return pickRandom([
      '🚗 Về luật: Nếu không có biển cấm dừng đỗ thì bạn được đỗ. Về tình: Đỗ chắn cửa nhà người ta là dễ "ăn mắng" lắm đó ^^.',
      'Mẹo sống còn: Đỗ xe nhớ để lại số điện thoại trên kính. Lỡ chắn lối đi thì người ta còn gọi mình ra đánh xe đi, đỡ bị xước xe oan.',
      'Đỗ xe nhớ quan sát: Tránh miệng cống, tránh trạm bơm nước và tuyệt đối không chặn lối ra vào của xe cứu hỏa/cấp cứu.'
    ]);
  }

  // --- 16. XE BUÝT & PHƯƠNG TIỆN CÔNG CỘNG ---
  if (input.includes('xe buýt') || input.includes('xe bus') || input.includes('làn brt')) {
    return pickRandom([
      '🚌 Thấy xe buýt xi nhan rời bến là phải nhường ngay nhé. Xe to, điểm mù lớn, đừng cố chen lên tạt đầu nguy hiểm lắm.',
      'Làn BRT (buýt nhanh) là "vùng cấm bay" của xe thường nha. Đi vào đấy camera phạt nguội chụp nét căng đấy!',
      'Nhường đường cho xe buýt là văn minh. Họ chở mấy chục người lận, mình đi xe máy nhỏ gọn thì nhường chút có sao đâu nè.'
    ]);
  }

  // --- 17. KHÍ THẢI & Ô NHIỄM (Luật mới cho xe máy) ---
  if (input.includes('khí thải') || input.includes('khói xe') || input.includes('kiểm định xe máy')) {
    return pickRandom([
      '💨 Tin mới: Luật 2025 sẽ bắt đầu lộ trình kiểm tra khí thải xe máy cũ. Xe nào xả khói đen mù mịt là sắp tới bị "tuýt" đấy.',
      'Bảo vệ môi trường chút đi bạn ơi. Xe mà xả khói đen là vừa tốn xăng, vừa hại máy, lại sắp bị phạt theo luật mới rồi.',
      'Xe máy cũ quá thì nên đi bảo dưỡng lại phần động cơ. Sắp tới sẽ có quy định kiểm định khí thải bắt buộc cho xe máy đó.'
    ]);
  }

  // --- 18. HÚT THUỐC KHI LÁI XE ---
  if (input.includes('hút thuốc') || input.includes('châm thuốc')) {
    return pickRandom([
      '🚬 Vừa lái vừa hút thuốc: Gió tạt tàn thuốc vào mắt là "mù" tạm thời luôn đấy. Cực kỳ nguy hiểm!',
      'Nên dừng xe lại rồi hãy hút bạn à. Vừa lái vừa cầm điếu thuốc rất khó xử lý phanh tay nếu gặp tình huống bất ngờ.',
      'Chưa kể tàn thuốc bay ra phía sau có thể làm bỏng người đi xe máy khác hoặc gây cháy nổ nữa. Tốt nhất là không nên nhé.'
    ]);
  }

  // --- 19. MỞ CỬA XE Ô TÔ (Lỗi chết người) ---
  if (input.includes('mở cửa') || input.includes('mở cửa xe')) {
    return pickRandom([
      '🚪 Quy tắc tay phải: Dùng tay phải mở chốt cửa trái (để người xoay lại quan sát phía sau). Mở cửa ẩu gây tai nạn là đi tù như chơi!',
      'Nhớ quan sát gương chiếu hậu trước khi mở cửa xe! Mở "huỵch" một cái là người đi xe máy phía sau lãnh đủ đấy.',
      'Hé cửa nhẹ nhàng, quan sát kỹ rồi mới mở hẳn. Chỉ 1 giây bất cẩn mở cửa xe có thể gây ra tai nạn thảm khốc.'
    ]);
  }
  // --- CHI TIẾT: QUY ĐỊNH VỀ ĐÈN VÀNG (DỪNG HAY ĐI?) ---
  if (input.includes('đèn vàng') || input.includes('vượt đèn vàng')) {
    return 'Quy tắc tín hiệu Đèn vàng:\n• Đèn vàng bật sáng: Phải dừng lại trước vạch dừng.\n• Trường hợp đã đi quá vạch dừng khi đèn chuyển vàng: Được phép đi tiếp.\n• Đèn vàng nhấp nháy: Được đi nhưng phải giảm tốc độ và chú ý quan sát.\n⚠️ Lưu ý: Vượt đèn vàng khi chưa qua vạch sẽ bị xử phạt như vượt đèn đỏ.';
  }

  // --- CHI TIẾT: QUY TẮC QUAY ĐẦU XE ---
  if (input.includes('quay đầu') || input.includes('quay xe') || input.includes('chỗ quay đầu')) {
    return 'Các vị trí CẤM quay đầu xe:\n1. Phần đường dành cho người đi bộ qua đường.\n2. Trên cầu, đầu cầu, gầm cầu vượt, ngầm.\n3. Trong hầm đường bộ.\n4. Đường cao tốc.\n5. Tại nơi có biển báo cấm quay đầu xe.\nChỉ quay đầu tại nơi đường giao nhau hoặc có biển báo cho phép quay đầu.';
  }

  // --- CHI TIẾT: QUY TẮC DỪNG XE, ĐỖ XE TRONG PHỐ ---
  if (input.includes('dừng xe') || input.includes('đỗ xe') || input.includes('đậu xe')) {
    return 'Quy tắc dừng/đỗ xe trong đô thị:\n• Phải đỗ sát lề đường, hè phố phía bên phải theo chiều đi.\n• Bánh xe không được cách lề đường quá 0.25m.\n• Không dừng đỗ trên miệng cống thoát nước, miệng hầm đường dây điện thoại/điện cao thế.\n• Không để xe ở lòng đường, hè phố trái quy định gây cản trở giao thông.';
  }

  // --- CHI TIẾT: SỬ DỤNG ĐÈN CHIẾU XA/GẦN (PHA/CỐT) ---
  if (input.includes('đèn pha') || input.includes('đèn cốt') || input.includes('chiếu xa')) {
    return 'Quy định sử dụng đèn Pha/Cốt:\n• Trong khu đông dân cư: CHỈ được sử dụng đèn chiếu gần (Cốt).\n• Nghiêm cấm sử dụng đèn chiếu xa (Pha) trong đô thị hoặc khi có xe đi ngược chiều.\n• Vi phạm bật Pha trong phố: Phạt tiền từ 800k-1tr (xe máy) hoặc 4-6tr (ô tô).';
  }

  // --- CHI TIẾT: QUY ĐỊNH VỀ CÒI XE (ÂM THANH) ---
  if (input.includes('còi xe') || input.includes('bấm còi') || input.includes('tiếng còi')) {
    return 'Văn hóa và luật dùng còi xe:\n• CẤM bấm còi trong thời gian từ 22:00 giờ đến 05:00 giờ sáng hôm sau trong khu đông dân cư (trừ xe ưu tiên).\n• Trong đô thị, khu đông dân cư: Không được lắp đặt, sử dụng còi hơi.\n• Không bấm còi liên tục, gây ồn ào, mất trật tự công cộng.';
  }

  // --- CHI TIẾT: XE KÉO, ĐẨY XE KHÁC ---
  if (input.includes('kéo xe') || input.includes('đẩy xe') || input.includes('hết xăng')) {
    return 'Hành vi Cấm:\n• Nghiêm cấm xe máy, ô tô kéo hoặc đẩy xe khác, vật khác (trừ xe kéo chuyên dụng).\n• Hành vi dùng chân đẩy xe máy khác (khi hết xăng/hư hỏng) là vi phạm luật, gây nguy hiểm và sẽ bị phạt tiền.\n👉 Hãy gọi cứu hộ hoặc dắt bộ để đảm bảo an toàn.';
  }

  // --- CHI TIẾT: CHỞ HÀNG CỒNG KỀNH ---
  if (input.includes('cồng kềnh') || input.includes('chở hàng') || input.includes('giá đèo hàng')) {
    return 'Quy định giới hạn xếp hàng hóa trên xe máy:\n• Bề rộng: Không vượt quá giá đèo hàng mỗi bên 0.3m.\n• Phía sau: Không vượt quá 0.5m tính từ giá đèo hàng.\n• Chiều cao: Không quá 1.5m tính từ mặt đường.\nVi phạm sẽ bị phạt tiền và buộc dỡ bỏ hàng hóa.';
  }

  // --- CHI TIẾT: ĐI VÒNG XUYẾN (BÙNG BINH) ---
  if (input.includes('vòng xuyến') || input.includes('bùng binh') || input.includes('nhường đường vòng xuyến')) {
    return 'Quy tắc nhường đường tại vòng xuyến:\n• Có biển báo đi theo vòng xuyến: Phải nhường đường cho xe đi tới từ bên TRÁI.\n• Không có biển báo: Nhường đường cho xe đi tới từ bên PHẢI.\n• Luôn giảm tốc độ khi vào giao lộ.';
  }

  // --- CHI TIẾT: MỨC PHẠT TỐC ĐỘ CỤ THỂ ---
  if (input.includes('phạt tốc độ') || input.includes('quá tốc độ') || input.includes('bắn tốc độ')) {
    return 'Mức phạt chạy quá tốc độ (tham khảo):\n• Quá 5-10 km/h: Phạt 300k-400k (xe máy), 800k-1tr (ô tô).\n• Quá 10-20 km/h: Phạt 800k-1tr (xe máy), 4-6tr (ô tô) + Tước bằng.\n• Quá 20-35 km/h: Phạt cao + Tước bằng lái.\n• Quá trên 35 km/h: Phạt kịch khung + Tước bằng dài hạn.';
  }

  // --- CHI TIẾT: GÂY TAI NẠN BỎ CHẠY ---
  if (input.includes('bỏ chạy') || input.includes('trốn') || input.includes('bỏ trốn')) {
    return 'Hành vi gây tai nạn rồi bỏ trốn là rất nghiêm trọng:\n• Xử phạt hành chính: 16 - 18 triệu đồng (ô tô), 6 - 8 triệu đồng (xe máy).\n• Hình phạt bổ sung: Tước quyền sử dụng GPLX từ 5 - 7 tháng.\n• Nếu gây hậu quả nghiêm trọng có thể bị truy cứu trách nhiệm HÌNH SỰ.';
  }
  // --- 20. ĐEO TAI NGHE (Xe máy) ---
  if (input.includes('tai nghe') || input.includes('nghe nhạc') || input.includes('airpod')) {
    return pickRandom([
      '🎧 Đi xe máy cấm đeo tai nghe nha (kể cả 1 bên). Phạt tiền đấy! Cần nghe nhạc thì về nhà nghe cho "chill".',
      'Đeo tai nghe làm giảm khả năng nghe tiếng còi xe khác. Luật cấm tuyệt đối người điều khiển xe máy sử dụng thiết bị âm thanh (trừ thiết bị trợ thính).',
      'Tháo tai nghe ra đi bạn ơi. CSGT nhìn thấy là phạt từ 800k - 1 triệu đồng + tước bằng lái đấy, không rẻ đâu!'
    ]);
  }
  // --- CHI TIẾT: PHÂN HẠNG GIẤY PHÉP LÁI XE (MỚI 2025) ---
  if (input.includes('hạng a1') || input.includes('hạng a') || input.includes('bằng lái xe máy')) {
    return 'Quy định phân hạng GPLX xe máy từ 01/01/2025:\n• Hạng A1: Lái xe mô tô đến 125cc hoặc xe điện đến 11kW (Trước đây là 175cc).\n• Hạng A: Lái xe mô tô trên 125cc hoặc trên 11kW (Thay thế hạng A2 cũ).\n⚠️ Lưu ý: Bằng A1 cũ (cấp trước 2025) vẫn được tiếp tục sử dụng để lái xe đến 175cc như bình thường, không bắt buộc phải đổi.';
  }
  
  if (input.includes('hạng b') || input.includes('bằng b1') || input.includes('bằng b2') || input.includes('số tự động')) {
    return 'Quy định phân hạng GPLX ô tô từ 01/01/2025:\n• Hạng B: Gộp chung B1 và B2 cũ. Cấp cho người lái xe chở người đến 8 chỗ (không kể tài xế), xe tải đến 3.5 tấn. Được phép kinh doanh vận tải.\n• Hạng B1 (Mới): Cấp cho người lái xe mô tô 3 bánh và các loại xe cho người khuyết tật (Khác hoàn toàn B1 số tự động cũ).';
  }

  // --- CHI TIẾT: QUY ĐỊNH TRỪ ĐIỂM & PHỤC HỒI ĐIỂM ---
  if (input.includes('trừ điểm') || input.includes('hệ điểm') || input.includes('bao nhiêu điểm')) {
    return 'Cơ chế trừ điểm GPLX (12 điểm/năm):\n• Nguyên tắc: Vi phạm bị trừ điểm (2-10 điểm). Dữ liệu cập nhật ngay trên hệ thống VNeID.\n• Phục hồi: Nếu trong 12 tháng không bị trừ hết điểm -> Tự động hồi phục về 12 điểm.\n• Hệ quả: Nếu bị trừ hết 12 điểm -> Phải thi lại kiến thức pháp luật (Lý thuyết) mới được cấp lại điểm.';
  }

  // --- CHI TIẾT: QUY ĐỊNH VỀ TRẺ EM & THIẾT BỊ AN TOÀN ---
  if (input.includes('ghế trẻ em') || input.includes('chở con') || input.includes('ngồi trước')) {
    return 'Quy định an toàn cho trẻ em (Luật 2024):\n• Trẻ em dưới 10 tuổi VÀ chiều cao dưới 1.35m KHÔNG được ngồi hàng ghế trước (cạnh tài xế), trừ xe chỉ có 1 hàng ghế.\n• Bắt buộc sử dụng thiết bị an toàn phù hợp (ghế trẻ em/đệm nâng) từ 01/01/2026.\n• Xe máy: Chỉ được chở 1 trẻ em. Trẻ trên 6 tuổi bắt buộc đội mũ bảo hiểm.';
  }

  // --- CHI TIẾT: GIẤY TỜ ĐIỆN TỬ (VNeID) ---
  if (input.includes('vneid') || input.includes('giấy tờ điện tử') || input.includes('xuất trình')) {
    return 'Hiệu lực của VNeID:\n• Khi CSGT kiểm tra, bạn có thể xuất trình giấy tờ đã tích hợp trên VNeID (GPLX, Đăng ký xe, Bảo hiểm, Đăng kiểm).\n• Giá trị pháp lý: Tương đương bản giấy. CSGT không được yêu cầu thêm bản giấy nếu đã kiểm tra được trên VNeID.\n• Lưu ý: Nếu bị tạm giữ giấy tờ, CSGT sẽ thực hiện tạm giữ trên môi trường điện tử (trừ điểm/khóa bằng trên app).';
  }

  // --- CHI TIẾT: KIỂM SOÁT KHÍ THẢI XE MÁY ---
  if (input.includes('khí thải') || input.includes('kiểm định xe máy') || input.includes('khói xe')) {
    return 'Lộ trình kiểm định khí thải xe máy:\n• Luật 2024 quy định xe mô tô, xe gắn máy phải thực hiện kiểm kê khí thải.\n• Tuy nhiên, việc này sẽ thực hiện theo lộ trình (chưa phạt ngay lập tức).\n• Ưu tiên kiểm tra trước với các xe cũ nát, sử dụng lâu năm để giảm ô nhiễm môi trường.';
  }

  // --- CHI TIẾT: THỜI GIAN BẬT ĐÈN & SỬ DỤNG CÒI ---
  if (input.includes('giờ bật đèn') || input.includes('thời gian bật đèn') || input.includes('khung giờ')) {
    return 'Quy định thời gian sử dụng đèn xe:\n• Bắt buộc bật đèn chiếu sáng: Từ 18:00 giờ hôm trước đến 06:00 giờ hôm sau (Luật cũ là 19:00 - 05:00).\n• Trong hầm đường bộ: Bật đèn 24/24.\n• Sương mù/Thời tiết xấu: Bật đèn bất kể giờ giấc để đảm bảo an toàn.';
  }
  // --- 10. LỜI CHÀO (Siêu đa dạng & Tự nhiên - Hơn 25 mẫu câu) ---
  if (input.includes('xin chào') || input.includes('chào') || input.includes('hi') || input.includes('hello') || input.includes('hế lô') || input.includes('hola')) {
    return pickRandom([
      // Nhóm Thân thiện & Ngắn gọn
      'Chào bạn! Mình là trợ lý giao thông ảo đây 🤖. Bạn cần hỏi về mức phạt hay luật mới 2025?',
      'Hello! Rất vui được gặp bạn. Cần tra cứu luật gì cứ hỏi mình nhé, mình biết hết đó ^^',
      'Hi there! Mình giúp gì được cho bạn nè? Cứ hỏi tự nhiên nhé!',
      'Xin chào! Hôm nay bạn muốn hỏi về vấn đề gì? Mũ bảo hiểm, tốc độ hay nồng độ cồn?',
      'Hé lô! 👋 Đang thắc mắc về luật giao thông hả? Có mình ở đây rồi!',
      
      // Nhóm Hài hước & Vui vẻ
      'Chào đồng chí lái xe! 🚗 Cần hỗ trợ thông tin gì để tránh bị "tuýt còi" oan không nè?',
      'Hi! Đừng để mất tiền oan vì không nắm rõ luật nhé. Hỏi mình ngay đi, miễn phí 100%!',
      'Chào chào! 🚦 Đèn xanh rồi, thông tin thông suốt! Bạn cần hỏi gì mình trả lời ngay.',
      'Hello! Mình vừa "học thuộc lòng" xong luật mới 2025. Bạn có muốn thử thách mình câu nào khó khó không?',
      'Chào bạn tốt! Lái xe an toàn là trên hết, nhưng nắm rõ luật là trên cả trên hết. Hỏi mình đi!',
      'Alo alo! Trợ lý giao thông nghe rõ trả lời! Bạn cần tư vấn gì nào?',

      // Nhóm Quan tâm & Hữu ích
      'Chào bạn! Chúc bạn một ngày lái xe vạn dặm bình an. Cần kiểm tra quy định gì thì nhắn mình nha.',
      'Xin chào! Bạn đã nắm rõ quy định TRỪ ĐIỂM bằng lái mới chưa? Hỏi mình để mình chỉ cho nhé.',
      'Hi bạn! Đang đi đường hay đang ở nhà đó? Cần check phạt nguội hay luật nồng độ cồn thì ới mình một tiếng.',
      'Chào! Mình trực 24/7 ở đây để đảm bảo bạn không bao giờ bị "mù" luật giao thông.',
      'Chào bạn. Lái xe cẩn thận nhé! Nếu chưa rõ biển báo nào thì chụp ảnh hoặc mô tả cho mình biết nha.',

      // Nhóm Chuyên gia & Uy tín
      'Xin chào. Tôi là AI hỗ trợ pháp lý về Giao thông đường bộ. Bạn cần tra cứu điều khoản nào?',
      'Chào bạn. Tôi có dữ liệu đầy đủ về Luật 2024 và Nghị định xử phạt mới nhất. Mời bạn đặt câu hỏi.',
      'Hello! Xe máy, ô tô hay xe đạp điện mình đều nắm rõ luật hết. Bạn đang đi loại xe nào?',
      'Chào mừng bạn! Hãy hỏi mình về: Biển báo, Vạch kẻ đường, hay các lỗi vi phạm phổ biến nhé.',
      
      // Nhóm Ngẫu hứng & Teen
      'Hi hi! 👋 Cần tìm luật gì hơm?',
      'Hế lô! Lâu quá không gặp (đùa thôi). Cần mình giúp đỡ gì về luật lá không nè?',
      'Chào buổi sáng (hoặc chiều/tối)! Chúc bạn lái xe an toàn. Cần gì cứ ới mình nhé!',
      'Bonjour! À nhầm, Xin chào! Mình chỉ biết tiếng Việt thôi, hỏi luật giao thông đi bạn ơi!'
    ]);
  }

  // --- 11. MẶC ĐỊNH (Khi không hiểu - Hơn 20 mẫu câu đỡ nhàm chán) ---
  return pickRandom([
    // Nhóm Thú nhận "chưa học"
    'Hic, câu này khó quá, mình chưa được học 😅. Bạn thử hỏi ngắn gọn hơn xem sao? Ví dụ: "Vượt đèn đỏ phạt bao nhiêu?"',
    'Úi, kiến thức này mới quá! Mình đang update dần. Bạn hỏi câu khác dễ hơn được không?',
    'Xin lỗi nha, mình là Bot nên đôi khi hơi chậm hiểu. Bạn thử dùng từ khóa chính thôi nhé.',
    'Câu hỏi này nằm ngoài dữ liệu của mình rồi. Thử hỏi câu khác liên quan đến Luật giao thông nhé!',
    'Mình chưa hiểu ý bạn lắm. Bạn muốn hỏi về Mức phạt, Biển báo hay Luật mới 2025?',

    // Nhóm Gợi ý từ khóa (Hữu ích)
    'Bạn thử viết lại ngắn gọn hơn được không? Ví dụ: "Lỗi không gương", "Nồng độ cồn", "Vượt đèn đỏ"...',
    'Mình chưa bắt được từ khóa. Hay là bạn thử hỏi về: "Trừ điểm bằng lái" hoặc "Biển số định danh" xem?',
    'Ý bạn là muốn hỏi về mức phạt hay quy tắc đi đường? Hãy thử lại với từ khóa ngắn hơn nhé.',
    'Mình chuyên về Luật Giao Thông thôi, đừng hỏi chuyện tình cảm nha ^^. Thử hỏi về "Mũ bảo hiểm" đi!',
    'Có phải bạn muốn hỏi về lỗi vi phạm? Hãy gõ tên lỗi cụ thể, ví dụ: "Đi ngược chiều".',

    // Nhóm Hài hước & Nhẹ nhàng
    'Đang load... Đang load... 🤯 Xin lỗi, mình bị "tắc đường" thông tin rồi. Bạn hỏi lại câu khác nhé?',
    'Câu này hack não quá! 😵 Bạn nói rõ hơn một chút được không?',
    'Mình xin thua! 🏳️ Câu này khó hơn thi bằng lái nữa. Bạn thử hỏi câu khác dễ hơn đi.',
    'Alo, hình như sóng yếu (đùa đấy). Mình chưa hiểu câu này, bạn diễn đạt lại giúp mình với!',
    'Đừng làm khó Bot tội nghiệp mà 🥺. Hỏi ngắn gọn như "Vượt đèn đỏ" là mình trả lời được ngay!',

    // Nhóm Nghiêm túc & Hướng dẫn
    'Xin lỗi, tôi không tìm thấy thông tin phù hợp trong cơ sở dữ liệu Luật Giao Thông 2025.',
    'Vui lòng nhập câu hỏi rõ ràng hơn. Tôi có thể hỗ trợ về: Luật, Mức phạt, Biển báo, Giấy tờ xe.',
    'Thông tin bạn hỏi chưa có trong hệ thống. Vui lòng thử lại với các từ khóa phổ biến hơn.',
    'Rất tiếc, tôi chưa thể giải đáp câu hỏi này ngay lúc này.',
    'Tôi chưa hiểu rõ yêu cầu. Bạn hãy thử hỏi về: "Quy định nồng độ cồn", "Lỗi quá tốc độ", v.v.'
  ]);
};

const ChatWidget: React.FC<ChatWidgetProps> = ({ t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Random câu chào mở đầu luôn cho tự nhiên
    const welcomeMsgs = [
      t.welcome,
      "Chào bạn! Cần tra cứu luật giao thông 2025 không?",
      "Mình là trợ lý ảo Luật Giao Thông. Hỏi mình bất cứ gì nhé!"
    ];
    
    setMessages([{
      id: 'init',
      role: 'user', // Hoặc 'bot' tùy vào logic hiển thị của bạn
      text: pickRandom(welcomeMsgs),
      timestamp: new Date()
    }]);
  }, [t.welcome]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Random thời gian phản hồi (từ 0.5s đến 1s) để giống người đang gõ
    const randomDelay = Math.floor(Math.random() * 500) + 500;

    setTimeout(() => {
      const responseText = getResponse(userMsg.text);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMsg]);
      setIsLoading(false);
    }, randomDelay);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'} absolute bottom-0 right-0 transition-all duration-300 bg-blue-600 hover:bg-blue-700 text-white p-3.5 rounded-full shadow-lg flex items-center justify-center`}
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Window */}
      <div className={`${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-10 pointer-events-none'} transition-all duration-300 origin-bottom-right absolute bottom-0 right-0 w-[260px] sm:w-[300px] h-[380px] bg-white rounded-2xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-2.5 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1 rounded-lg">
              <Bot size={16} />
            </div>
            <h3 className="font-semibold text-sm">{t.title}</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5 bg-slate-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-2 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-2.5 rounded-2xl rounded-bl-none border border-slate-200 shadow-sm flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-2.5 bg-white border-t border-slate-200">
          <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-xl">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={t.placeholder}
              className="flex-1 bg-transparent border-none outline-none text-xs px-1 text-slate-800 placeholder-slate-400"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white p-1.5 rounded-lg transition-colors"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;