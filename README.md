# Beray BOS — Beray Intelligence

Beray'ın web tabanlı sistem kabuğu ve bağımsız uygulama prototipi.

## Ekranlar
- index.html: açılış animasyonu, ana ekran, uygulama arama/başlatma ve kurulu uygulamalar.
- index0.html: kilit ekranı + Beray Denetim Merkezi.
- index1.html: Beray içi posta.
- index2.html: Telefon arayüzü, yerel kişiler ve arama geçmişi.
- index3.html: Beray Intelligence sohbet arayüzü.
- index4.html: Beray Merkezi.

## Donanım katmanı — önemli
Bu depo tek başına bir donanım/işletim sistemi çekirdeği değildir; tarayıcıda çalışan ekran kabuğudur. Wi-Fi tarama, Bluetooth tarama, el feneri, hücresel veri, uçak modu, erişim noktası ve gerçek telefon araması için hedef cihazın kendi çekirdeğinde/sürücü servisinde çalışan imzalı bir Beray donanım servisi gerekir.

Kilit ekranı denetim merkezi yalnızca window.berayHardware arayüzü varsa donanım çağrısı yapar. Örnek sürücü sözleşmesi:

```js
window.berayHardware = {
  scanWifi: async () => [{ ssid: "örnek-ağ", signal: -48 }],
  scanBluetooth: async () => [{ id: "device-id", name: "cihaz" }],
  toggleRadio: async (name) => true,
  call: async (number) => ({ started: true })
};
```

Bu nesne yalnızca arayüz sözleşmesidir; bu depoda gerçek sürücü yoktur. Web tarayıcısı, sistem izinleri olmadan hücresel radyo veya uçak modunu kontrol edemez. Android ayarlarına yönlendirme yapılmaz. Uçak modu kilit ekranındaki Denetim Merkezi'nde devre dışıdır.

## Backend
Supabase project: zblbsjmtituericpmazj. Tarayıcıya yalnızca publishable key konur. Gizli/Service Role anahtarları asla bu depoya eklenmez.
- beray-ai: giriş doğrulamalı Edge Function.
- beray_mail: Beray hesapları arası iç posta MVP'si.
- beray_publications: aktif BYSAM/BSTORE yayın kataloğu.
- beray-submissions: özel başvuru kaynak kodu bucket'ı.
- beray-published: herkese açık yayın dosyaları bucket'ı.

## Yayın
GitHub Pages Settings → Pages → Build and deployment → GitHub Actions seçilirse pages.yml otomatik yayınlar. Beklenen adres: https://auraultrax.github.io/Beray-BOS/
