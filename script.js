document.getElementById('generateBtn').addEventListener('click', async () => {
  const imageFile = document.getElementById('image').files[0];
  const analysisType = document.querySelector('input[name="analysisType"]:checked').value;

  if (!imageFile) {
    Swal.fire({
      icon: 'error',
      title: '이미지를 선택하세요',
      text: '이미지를 선택하지 않았습니다.',
    });
    return;
  }

  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('analysisType', analysisType);

  // 로딩 팝업 표시
  const loadingPopup = Swal.fire({
    title: '로딩 중',
    html: '데이터를 처리하는 중입니다...',
    showConfirmButton: false,
  });

  try {
    const response = await fetch('http://localhost:5000/generate', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('서버 요청 중에 문제가 발생했습니다.');
    }

    const data = await response.json();

    // 성공 팝업
    const loadingPopup2 = Swal.fire({
      icon: "success",
      title: "Your work has been saved",
      showConfirmButton: false,
      timer: 1500
    });

    // 생성된 텍스트를 표시하는 div에 데이터 추가
    const generatedTextDiv = document.getElementById('generatedText');
    generatedTextDiv.innerHTML = data.generated_text;
  } catch (error) {
    // 에러 팝업 표시
    Swal.fire({
      icon: 'error',
      title: '에러 발생',
      text: error.message,
    });
  } finally {
    // 팝업 닫기
    loadingPopup.close();
    loadingPopup2.close();
  }
});

// 파일 선택이 완료된 후 이미지를 보여주는 함수
function showImagePreview() {
  const imageFile = document.getElementById('image').files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.innerHTML = `<img src="${e.target.result}" style="height: 150px;" class="mx-auto" alt="Image Preview">`;
  }

  if (imageFile) {
    reader.readAsDataURL(imageFile);
  }
}

// 폼 리셋 함수
document.getElementById('resetBtn').addEventListener('click', () => {
  document.getElementById('image').value = ''; // 이미지 파일 선택 초기화
  document.querySelector('input[name="analysisType"][value="calorie"]').checked = true; // 라디오 버튼 초기화
  document.getElementById('imagePreview').innerHTML = ''; // 이미지 미리보기 초기화
  document.getElementById('generatedText').innerHTML = ''; // 생성된 텍스트 초기화
});