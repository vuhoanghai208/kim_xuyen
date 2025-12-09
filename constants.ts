import { Translation, StatData, CauseData, ComicSeries, VideoItem } from './types';

export const TRANSLATIONS: Record<'en' | 'vi', Translation> = {
  en: {
    nav: {
      home: "Home",
      stats: "Statistics",
      comics: "Comics",
      videos: "Videos",
      chat: "Safety Assistant",
    },
    hero: {
      title: "Drive Safe, Stay Safe",
      subtitle: "Join us in making Vietnam's roads safer for everyone through education, awareness, and responsible driving.",
      cta: "Explore Statistics",
    },
    stats: {
      title: "Traffic Safety Statistics in Vietnam",
      accidents: "Total Accidents",
      fatalities: "Fatalities",
      injuries: "Injuries",
      chartTitle: "Annual Accident Trends",
      causeTitle: "Primary Causes of Accidents",
    },
    comics: {
      title: "Traffic Safety Library",
      subtitle: "Select a book to start learning about road safety.",
      readNow: "Read Now",
      page: "Page",
      close: "Close",
    },
    videos: {
      title: "Educational Videos",
      subtitle: "Watch and learn essential driving skills and safety tips.",
    },
    chat: {
      placeholder: "Ask about traffic laws in Vietnam...",
      welcome: "Hello! I am your AI Traffic Safety Assistant. Ask me anything about Vietnamese traffic laws, fines, or safety tips.",
      thinking: "Thinking...",
      send: "Send",
      title: "Safety Assistant",
    },
  },
  vi: {
    nav: {
      home: "Trang chủ",
      stats: "Thống kê",
      comics: "Truyện tranh",
      videos: "Video",
      chat: "Trợ lý an toàn",
    },
    hero: {
      title: "An toàn giao thông là hạnh phúc",
      subtitle: "Chung tay xây dựng văn hóa giao thông an toàn tại Việt Nam thông qua giáo dục và ý thức trách nhiệm.",
      cta: "Xem thống kê",
    },
    stats: {
      title: "Thống kê An toàn Giao thông Việt Nam",
      accidents: "Số vụ tai nạn",
      fatalities: "Người tử vong",
      injuries: "Người bị thương",
      chartTitle: "Xu hướng tai nạn hàng năm",
      causeTitle: "Nguyên nhân chính gây tai nạn",
    },
    comics: {
      title: "Thư Viện Truyện Tranh",
      subtitle: "Chọn một cuốn truyện để bắt đầu tìm hiểu luật giao thông.",
      readNow: "Đọc ngay",
      page: "Trang",
      close: "Đóng",
    },
    videos: {
      title: "Video Giáo dục",
      subtitle: "Xem và học các kỹ năng lái xe an toàn.",
    },
    chat: {
      placeholder: "Hỏi về luật giao thông...",
      welcome: "Xin chào! Tôi là Trợ lý AI về An toàn Giao thông. Hãy hỏi tôi về luật, mức phạt hoặc mẹo lái xe an toàn.",
      thinking: "Đang suy nghĩ...",
      send: "Gửi",
      title: "Trợ lý ảo",
    },
  },
};

export const ACCIDENT_STATS: StatData[] = [
  { year: '2019', accidents: 17626, fatalities: 7624, injuries: 13624 },
  { year: '2020', accidents: 14510, fatalities: 6700, injuries: 10804 },
  { year: '2021', accidents: 11495, fatalities: 5799, injuries: 8018 },
  { year: '2022', accidents: 11457, fatalities: 6397, injuries: 7804 },
  { year: '2023', accidents: 22067, fatalities: 11628, injuries: 15292 },
];

export const CAUSE_STATS: CauseData[] = [
  { name: 'Speeding (Quá tốc độ)', value: 35 },
  { name: 'Wrong Lane (Sai làn)', value: 25 },
  { name: 'Alcohol (Rượu bia)', value: 15 },
  { name: 'Overtaking (Vượt ẩu)', value: 10 },
  { name: 'Others (Khác)', value: 15 },
];

// --- DỮ LIỆU MỚI: 7 BỘ TRUYỆN ---
export const COMIC_SERIES: ComicSeries[] = [
  {
    id: 1,
    title: "Tập 1: Ngã Rẽ Định Mệnh",
    coverUrl: "/img/img_1.png",
    description: "Những bài học vỡ lòng cho các bạn học sinh khi tham gia giao thông.",
    pages: ["/img/img_2.png", "/img/img_3.png","/img/img_4.png","/img/img_5.png","/img/img_6.png","/img/img_7.png","/img/img_8.png","/img/img_9.png","/img/img_10.png","/img/img_11.png","/img/img_12.png","/img/img_13.png","/img/img_14.png","/img/img_15.png","/img/img_16.png"] 
  },
  {
    id: 2,
    title: "Tập 2: TẦM QUAN TRỌNG CỦA VIỆC TUÂN THỦ CÁC QUY TẮC AN TOÀN GIAO THÔNG ĐƯỜNG BỘ",
    coverUrl: "/bai_2/bai_2_1.jpg",
    description: "Việc tuân thủ an toàn giao thông để bảo vệ chính mình và cộng đồng.",
    pages: ["/bai_2/bai_2_2.jpg", "/bai_2/bai_2_3.jpg", "/bai_2/bai_2_4.jpg", "/bai_2/bai_2_5.jpg", "/bai_2/bai_2_6.jpg", "/bai_2/bai_2_7.png", "/bai_2/bai_2_8.png", "/bai_2/bai_2_9.png", "/bai_2/bai_2_10.png", "/bai_2/bai_2_11.png", "/bai_2/bai_2_12.png", "/bai_2/bai_2_13.png", "/bai_2/bai_2_14.png", "/bai_2/bai_2_15.png"]
  },
  {
    id: 3,
    title: "Tập 3: HỆ THỐNG BÁO HIỆU GIAO THÔNG ĐƯỜNG BỘ",
    coverUrl: "/bai_3/bai_3_1.png",
    description: "Giới thiệu các loại báo hiệu giao thông đường bộ và vai trò của chúng trong việc đảm bảo an toàn khi tham gia giao thông.",
    pages: ["/bai_3/bai_3_2.png", "/bai_3/bai_3_3.png", "/bai_3/bai_3_4.png", "/bai_3/bai_3_5.png", "/bai_3/bai_3_6.png", "/bai_3/bai_3_7.png", "/bai_3/bai_3_8.png", "/bai_3/bai_3_9.png", "/bai_3/bai_3_10.png", "/bai_3/bai_3_11.png", "/bai_3/bai_3_12.png", "/bai_3/bai_3_13.png", "/bai_3/bai_3_14.png", "/bai_3/bai_3_15.png", "/bai_3/bai_3_16.png", "/bai_3/bai_3_17.png", "/bai_3/bai_3_18.png", "/bai_3/bai_3_19.png", "/bai_3/bai_3_20.png"]
  },
  {
    id: 4,
    title: "Tập 4: DỰ ĐOÁN VÀ PHÒNG TRÁNH NGUY HIỂM",
    coverUrl: "/xe_dap/xe_dap_1.png",
    description: "Giới thiệu cách nhận biết, dự đoán và phòng tránh các nguy hiểm khi tham gia giao thông, giúp bảo đảm an toàn cho bản thân và người khác.",
    pages: ["/xe_dap/xe_dap_2.png", "/xe_dap/xe_dap_3.png", "/xe_dap/xe_dap_4.png", "/xe_dap/xe_dap_5.png", "/xe_dap/xe_dap_6.png", "/xe_dap/xe_dap_7.png", "/xe_dap/xe_dap_8.png", "/xe_dap/xe_dap_9.png", "/xe_dap/xe_dap_10.png", "/xe_dap/xe_dap_11.png", "/xe_dap/xe_dap_12.png", "/xe_dap/xe_dap_13.png", "/xe_dap/xe_dap_14.png" ]
  },
  {
    id: 5,
    title: "Tập 5: CÁCH ĐI XE ĐẠP, XE ĐẠP ĐIỆN AN TOÀN VÀ TRANG PHỤC KHI THAM GIA GIAO THÔNG",
    coverUrl: "/chu_quan/tai_nan_1.png",
    description: "Lựa chọn trang phục phù hợp để tự bảo vệ mình và góp phần xây dựng một môi trường giao thông văn minh, an toàn cho tất cả.",
    pages: ["/chu_quan/tai_nan_2.png", "/chu_quan/tai_nan_3.png", "/chu_quan/tai_nan_4.png", "/chu_quan/tai_nan_5.png", "/chu_quan/tai_nan_6.png", "/chu_quan/tai_nan_7.png", "/chu_quan/tai_nan_8.png", "/chu_quan/tai_nan_9.png", "/chu_quan/tai_nan_10.png", "/chu_quan/tai_nan_11.png", "/chu_quan/tai_nan_12.png"]
  },
  {
    id: 6,
    title: "Tập 6: CHUẨN BỊ ĐIỀU KHIỂN XE MÔ TÔ, XE GẮN MÁY AN TOÀN",
    coverUrl: "/bai_5/bai_5_1.png",
    description: "Chuẩn bị đầy đủ để lái xe an toàn.",
    pages: ["/bai_5/bai_5_2.png", "/bai_5/bai_5_3.png", "/bai_5/bai_5_4.png", "/bai_5/bai_5_5.png", "/bai_5/bai_5_6.png", "/bai_5/bai_5_7.png", "/bai_5/bai_5_8.png", "/bai_5/bai_5_9.png", "/bai_5/bai_5_10.png", "/bai_5/bai_5_11.png", "/bai_5/bai_5_12.png", "/bai_5/bai_5_13.png"]
  },
  {
    id: 7,
    title: "Tập 7: AN TOÀN GIAO THÔNG ĐƯỜNG SẮT VÀ ĐƯỜNG THỦY",
    coverUrl: "/bai_6/bai_6_1.png",
    description: "Những quy tắc cần nhớ để an toàn khi tham gia giao thông đường sắt và đường thủy.",
    pages: ["/bai_6/bai_6_2.png", "/bai_6/bai_6_3.png", "/bai_6/bai_6_4.png", "/bai_6/bai_6_5.png", "/bai_6/bai_6_6.png", "/bai_6/bai_6_7.png", "/bai_6/bai_6_8.png", "/bai_6/bai_6_9.png", "/bai_6/bai_6_10.png", "/bai_6/bai_6_11.png", "/bai_6/bai_6_12.png", "/bai_6/bai_6_13.png", "/bai_6/bai_6_14.png", "/bai_6/bai_6_15.png", "/bai_6/bai_6_16.png", "/bai_6/bai_6_17.png"]
  },
];

export const VIDEOS: VideoItem[] = [
  {
    id: 1,
    title: "video 1",
    videoUrl: "/video/video_1.mp4", 
    posterUrl: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=1000&auto=format&fit=crop",
    duration: "0:31",
    source: "Nguồn: https://t.me/hongbien_ez and facebook.com",
    watermark: "hongbien_ez",
    endPosters: [
      "/poster/poster_1.png", // Poster 1
      "/poster/poster_2.png", // Poster 2
      "/poster/poster_3.png"  // Poster 3
    ]
  },
  {
    id: 2,
    title: "video 2",
    videoUrl: "/video/video_2.mp4",
    posterUrl: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=1000&auto=format&fit=crop",
    duration: "0:18",
    source: "Nguồn: https://t.me/hongbien_ez and facebook.com",
    watermark: "hongbien_ez",
    endPosters: [
      "/poster/poster_4.png",
      "/poster/poster_5.png",
      "/poster/poster_6.png"
    ]
  },
  {
    id: 3,
    title: "video 3",
    videoUrl: "/video/video_3.mp4",
    posterUrl: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=1000&auto=format&fit=crop",
    duration: "0:16",
    source: "Nguồn: https://t.me/hongbien_ez and facebook.com",
    watermark: "hongbien_ez",
    endPosters: [
      "/poster/poster_7.png",
      "/poster/poster_8.png",
      "/poster/poster_9.png"
    ]
  }
];