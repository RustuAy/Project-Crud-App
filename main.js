import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import {
  form,
  grocery,
  list,
  container,
  displayAlert,
  submitBtn,
  clearBtn,
} from "./JS/helper.js";

// ?Düzenleme Seçenekleri
let editElement;
let editFlag = false; //*Düzenleme modunda olup olmadığını belirtir.
let editID = ""; //*Düzenleme yapılacak öğenin benzersiz kimliği

// !Fonksiyonlar
// *Silme butonuna tıkladığımızda çalışır.
const deleteItem = (e) => {
  // *Sil butonuna bastığımızda parentElement ile silmek istediğimiz article etiketine ulaşıyoruz.
  // const element = e.target.parentElement.parentElement.parentElement;
  // ?Belirli bir kimliğe göre arama yapmak için kullanılır.Üstteki  işlemle aynıdır daha kısa yazılır.
  const element = e.currentTarget.closest(".grocery-item");

  const id = element.dataset.id;

  list.removeChild(element);

  displayAlert("Başarıyla Kaldırıldı", "danger");

  removeFromLocalStorage(id);
};

// *Güncelleme butonuna bastığımızda çalışır.

const editItem = (e) => {
  // *Kapsayıcı üzerinden kardeş etikete ulaştık.
  const element = e.currentTarget.closest(".grocery-item");
  editElement = e.target.parentElement.parentElement.previousElementSibling;
  // *DÜzenlemeye tıklanıldığında Form içerisinde bulunan inputun değerini düzenlenen öğenin metniyle doldur
  grocery.value = editElement.innerHTML;

  editFlag = true;
  // *Düzenlenen öğenin kimliğini al.
  editID = element.dataset.id;
  submitBtn.textContent = "Düzenle";
};

// *form gönderildiğinde çalışır.
const addItem = (e) => {
  // * sayfanın yenilenmesini engeller.
  e.preventDefault();
  // * Inputun değerini alıp değişkene aktardık.
  const value = grocery.value;

  // *uuid kütüphanesi kullanarak benzersiz id oluşturmak için bu function kullanılır
  // * date kullanımından daha sağlıklıdır.
  const id = uuidv4();
  // console.log(id);

  // *benzersiz id almak için tarihten faydalanabiliriz...
  // const id = new Date().getTime().toString();
  // console.log(id);

  // *Eğer inputun içerisi boş değilse ve düzenleme modunda değilsek.
  if (value !== "" && !editFlag) {
    // *Yeni bir article etiketi oluşturmak için createElement metodunu kullandık.
    // *burada kullanma amacımız dinamik hale getirip html içerisinde defalarca yazmamak için.
    const element = document.createElement("article");

    // *Yeni bir veri kimliği oluşturur.
    let attr = document.createAttribute("data-id");

    attr.value = id;

    element.setAttributeNode(attr); //*Oluşturduğumuzx ID 'yi elemente ekledik.

    // ?Oluşturduğumuz article etiketine grocery-item classını ekledik.
    element.classList.add("grocery-item");

    // ?Oluşturduğumuz article etiketi içerisine html etiketlerimizi aktardık ve dinamikleşti.
    element.innerHTML = ` <p class="title">${value}</p>
            <div class="btn-container">
              <button type="button" class="edit-btn">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button type="button" class="delete-btn">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>`;

    // *list kapsayıcısına oluşturduğumuz article etiketini ekledik.
    list.appendChild(element);
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);

    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);

    // *containera show-cpntainer classı ekledik

    container.classList.add("show-container");
    displayAlert("Başarıyla Eklenildi", "success");
    // *LOcalStorage ekleme işlemi yapacak fonksiyona eklemek istediğim verinin idsini ve valuesini parametre olarak göndermeye yaradı

    addToLocalStorage(id, value);

    grocery.value = "";
  } else if (value !== "" && editFlag) {
    editElement.innerHTML = value;
    submitBtn.textContent = "Ekle";
    displayAlert("Değer Değiştirildi", "success");

    editLocalStorage(editID, value);
    grocery.value = "";
  }
};

const clearItems = () => {
  // *container.innerHTML =""; methoduyla hepsini silebiliriz en kolay yöntemdir.
  const items = document.querySelectorAll(".grocery-item");
  if (items.lenght > 0) {
    items.forEach((item) => list.removeChild(item));
  }
  container.classList.remove("show-container");

  // *localstorageden list verisini silme işlemine yarar
  localStorage.removeItem("list");
};

// *local storageda veri varsa getir yoksa boş bir dizi döndür
const getLocalStorage = () => {
  // * localstoragede list verisi varsa veriyi getir yoksa boş dizi çevir
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
};
// *localstorage'a ekleme işlemi yapmak.
const addToLocalStorage = (id, value) => {
  const grocery = { id, value };
  let items = getLocalStorage();
  items.push(grocery);
  console.log(items);
  localStorage.setItem("list", JSON.stringify(items));
};

// *LOcalStorageden id ye göre silme işlemi
const removeFromLocalStorage = (id) => {
  let items = getLocalStorage();

  items = items.filter((item) => item.id !== id);

  // *localstorageye güncellenmiş veriyi gönderdik.
  localStorage.setItem("list", JSON.stringify(items));
};

const editLocalStorage = (id, value) => {
  let items = getLocalStorage();

  // items = items.map((item) => {
  //   if (item.id === id) {
  //     item.value = value;
  //   }
  //   return item;
  // });

  items = items.map((item) => (item.id === id ? { ...item, value } : item));

  localStorage.setItem("list", JSON.stringify(items));
};

const createListItem = (id, value) => {
  // *Yeni bir article etiketi oluşturmak için createElement metodunu kullandık.
  // *burada kullanma amacımız dinamik hale getirip html içerisinde defalarca yazmamak için.
  const element = document.createElement("article");

  // *Yeni bir veri kimliği oluşturur.
  let attr = document.createAttribute("data-id");

  attr.value = id;

  element.setAttributeNode(attr); //*Oluşturduğumuzx ID 'yi elemente ekledik.

  // ?Oluşturduğumuz article etiketine grocery-item classını ekledik.
  element.classList.add("grocery-item");

  // ?Oluşturduğumuz article etiketi içerisine html etiketlerimizi aktardık ve dinamikleşti.
  element.innerHTML = ` <p class="title">${value}</p>
            <div class="btn-container">
              <button type="button" class="edit-btn">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button type="button" class="delete-btn">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>`;

  // *list kapsayıcısına oluşturduğumuz article etiketini ekledik.
  list.appendChild(element);
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);

  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);
};

const setupItems = () => {
  let items = getLocalStorage();

  if (items.length > 0) {
    items.forEach((item) => {
      createListItem(item.id, item.value);
    });
    container.classList.add("show-container");
  }
};

//!Olay İzleyicileri
// *forma gönderme olayı ekle ve gönderme olayında addItem fonk. çalıştır.
form.addEventListener("submit", addItem);

clearBtn.addEventListener("click", clearItems);

// *Sayfa yüklendiğinde setupItems fonksiyonunu çalıştır
window.addEventListener("DOMContentLoaded", setupItems);
