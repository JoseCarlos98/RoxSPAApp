import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'img',
})
export class ImgPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(uuid: any, id: any, type: string): any {
    if (uuid) {
      let url = `${
        environment.apiUrl
      }/UploadedFiles/getUploadedFiles?&uuid=${uuid}&id=${id}&type=${type}&random=${Math.floor(
        Math.random() * 1000
      )}`;
      let secureUrl = this.sanitizer.bypassSecurityTrustUrl(url);
      return secureUrl;
    } else {
      return 'assets/img/noimage.png';
    }
  }
}
