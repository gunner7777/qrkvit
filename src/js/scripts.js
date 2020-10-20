var draw_qrcode = function (text, typeNumber, errorCorrectLevel) {
  document.write(create_qrcode(text, typeNumber, errorCorrectLevel));
};

var create_qrcode = function (text, typeNumber, errorCorrectLevel, table) {
  var qr = qrcode(typeNumber || 4, errorCorrectLevel || "M");
  qr.addData(text);
  qr.make();

  return qr.createImgTag();
};

const UserData = {
  Fiostud: null,
  contract: null,
  Sum: null,
  paymPeriod: null,
  Purpose: null,
  Classnum: null,
  payer: null,
  category: "0",
  techCode: "0",
};

document.addEventListener("DOMContentLoaded", (e) => {
  document
    .querySelector(".KvitForm-Form")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      toggleModal(document.querySelector(".Modal").parentNode);

      createQR();
      // setCurrentDate();

      const ekzTextNodes = document.querySelectorAll(".Kvit-EkzText");
      ekzTextNodes.forEach((node, i) => {
        node.innerHTML = EKZ_SIDE[i];
      });

      fillKvit();
    });

  event.target.addEventListener("click", (e) => {
    if (e.target.classList.contains("Modal-Button_Print")) {
      printElement(document.querySelector(".Modal-Text"));
      window.print();
      formCleaner(document.querySelector(".KvitForm-Form"));
    } else if (
      e.target.classList.contains("Modal-Button_Close") ||
      e.target.classList.contains("Modal-Outer")
    ) {
      toggleModal(document.querySelector(".Modal-Outer"));
      cleanPrintForm(document.querySelector(".printForm-Outer"));
    }
  });

  /* document
    .querySelector(".Modal-Button_Print")
    .addEventListener("click", () => {
      printElement(document.querySelector(".Modal-Text"));
      window.print();
    }); */

  /* document
    .querySelector(".Modal-Button_Close")
    .addEventListener("click", (e) => {
      toggleModal(e.target.parentNode.parentNode.parentNode);
      cleanPrintForm(document.querySelector(".printForm-Outer"));
    });

  document.querySelector(".Modal-Outer").addEventListener("click", (e) => {
    toggleModal(e.target);
  }); */
});

const createQR = () => {
  let text = "ST00012|";
  for (let prop in QR_DATA) {
    text += prop + "=" + QR_DATA[prop] + "|";
  }

  UserData.Fiostud =
    document.getElementById("lastname").value +
    " " +
    document.getElementById("firstname").value +
    " " +
    document.getElementById("middlename").value;
  UserData.contract = document.getElementById("dogNumber").value;

  let kopSumFormat =
    document.getElementById("sumKop").value.length > 1
      ? document.getElementById("sumKop").value
      : "0" + document.getElementById("sumKop").value;

  UserData.Sum = document.getElementById("sumRub").value + kopSumFormat;
  UserData.paymPeriod = document.getElementById("paymPeriod").value;
  UserData.Purpose = document.getElementById("purpose").value;
  UserData.Classnum = document.getElementById("department").value;
  UserData.payer =
    document.getElementById("payer").value !== ""
      ? document.getElementById("payer").value
      : null;

  let i = Object.keys(UserData).length;
  for (let prop in UserData) {
    if (i !== 1) {
      if (UserData[prop] !== null) {
        text += prop + "=" + UserData[prop] + "|";
      }
    } else {
      text += prop + "=" + UserData[prop];
    }
    i--;
  }

  text = text.replace(/^[\s\u3000]+|[\s\u3000]+$/g, "");
  const T = 20;
  const E = "M";

  document.querySelector(".KvitTable-Qr").innerHTML = create_qrcode(text, T, E);
};

const toggleModal = (node) => {
  node.classList.toggle("Modal-Outer_Show");
};

const fillKvit = () => {
  insertInfo(document.querySelectorAll(".Kvit-Date"), setCurrentDate());
  insertInfo(document.querySelectorAll(".KvitTable-Rekvizit"), REKVIZIT);
  if (UserData.payer !== null) {
    insertInfo(document.querySelectorAll(".KvitTable-Payer"), UserData.payer);
  }
  insertInfo(document.querySelectorAll(".KvitTable-Fiostud"), UserData.Fiostud);
  insertInfo(
    document.querySelectorAll(".KvitTable-Contract"),
    UserData.contract
  );
  insertInfo(document.querySelectorAll(".KvitTable-Purpose"), UserData.Purpose);
  insertInfo(
    document.querySelectorAll(".KvitTable-Classnum"),
    UserData.Classnum
  );

  let kopSumFormat =
    document.getElementById("sumKop").value.length > 1
      ? document.getElementById("sumKop").value
      : "0" + document.getElementById("sumKop").value;

  insertInfo(
    document.querySelectorAll(".KvitTable-Sum"),
    document.getElementById("sumRub").value + "," + kopSumFormat
  );
  insertInfo(
    document.querySelectorAll(".KvitTable-PaymPeriod"),
    UserData.paymPeriod
  );
};

const insertInfo = (nodes, info) => {
  nodes.forEach((node) => {
    node.innerHTML = info;
  });
};

const setCurrentDate = () => {
  let today = new Date();
  let day = today.getDate();
  let month;
  switch (today.getMonth()) {
    case 0:
      month = "января";
      break;
    case 1:
      month = "февраля";
      break;
    case 2:
      month = "марта";
      break;
    case 3:
      month = "апреля";
      break;
    case 4:
      month = "мая";
      break;
    case 5:
      month = "июня";
      break;
    case 6:
      month = "июля";
      break;
    case 7:
      month = "августа";
      break;
    case 8:
      month = "сентября";
      break;
    case 9:
      month = "октября";
      break;
    case 10:
      month = "ноября";
      break;
    case 11:
      month = "декабря";
      break;
  }
  let year = today.getFullYear();
  return day + " " + month + " " + year;
};

const printElement = (elem, append, delimiter) => {
  var domClone = elem.cloneNode(true);

  var $printSection = document.getElementById("printForm");

  if (!$printSection) {
    var $printSection = document.createElement("div");
    $printSection.id = "printForm";
    document.querySelector(".printForm-Outer").appendChild($printSection);
  }

  if (append !== true) {
    $printSection.innerHTML = "";
  } else if (append === true) {
    if (typeof delimiter === "string") {
      $printSection.innerHTML += delimiter;
    } else if (typeof delimiter === "object") {
      $printSection.appendChlid(delimiter);
    }
  }

  $printSection.appendChild(domClone);
};

const cleanPrintForm = (node) => {
  node.innerHTML = "";
};

const formCleaner = (formHandler) => {
  formHandler.reset();
};
