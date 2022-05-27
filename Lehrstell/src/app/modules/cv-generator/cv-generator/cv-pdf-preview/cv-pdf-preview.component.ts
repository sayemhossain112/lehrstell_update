import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import { CommonService } from 'src/app/core/services/common.service';
import { Router } from '@angular/router';
import { DomSanitizer } from "@angular/platform-browser";
import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel,
    BorderStyle,
    ImageRun,
    TextWrappingType,
    TextWrappingSide,
} from "docx";
import { DatePipe } from '@angular/common';
// declare function myfunction(params1: string, params2: string): any;
// declare function getPDF(): any;
@Component({
    selector: 'app-cv-pdf-preview',
    templateUrl: './cv-pdf-preview.component.html',
    styleUrls: ['./cv-pdf-preview.component.scss']
})
export class CvPdfPreviewComponent implements OnInit {
    @ViewChild('content') content!: ElementRef;

    siblingsNamesString = '';
    loader = false;
    schooling = false;
    siblings = false;
    languages = false;
    hobbys = false;
    trailApprentice = false;
    references = false;

    constructor(public commonService: CommonService, private router: Router, public sanitizer: DomSanitizer) { }

    ngOnInit(): void {
        // console.log("siblingsNamesString-->", this.commonService.siblings)
        let data = this.commonService.siblings.map((result: any) => {
            return result['firstname'] + ' (' + result['job'] + ')'
        })
        this.siblingsNamesString = data.join(', ')
        this.siblingsNamesString = this.siblingsNamesString.replace('()', ' ')
        // console.log("siblingsNamesString-->", this.siblingsNamesString)
        this.checkingArrayOfObjectEmpty()
    }
    
    convertToPDF() {
        this.loader = true
        let that = this
        html2canvas(document.getElementById('pdf-page')!, {
            allowTaint: true,
            scale: 4,
            width: this.content.nativeElement.offsetWidth,
            height: this.content.nativeElement.offsetHeight
        }).then(function (canvas) {
            const contentDataURL = canvas.toDataURL('image/jpeg')
            let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
            var width = pdf.internal.pageSize.getWidth();
            var height = canvas.height * width / canvas.width;
            pdf.addImage(contentDataURL, 'JPEG', 0, 0, width, height)
            let name = 'lehrstell-' + new Date().toUTCString() + '.pdf'
            pdf.save(name); // Generated PDF
            that.loader = false
        });
    }

    checkingArrayOfObjectEmpty() {
        this.commonService.schooling.map((data: any) => {
            if (data['von'] != "") {
                this.schooling = true
            }
        })
        this.commonService.languages.map((data: any) => {
            if (data['language'] != "") {
                this.languages = true
            }
        })
        this.commonService.hobbys.map((data: any) => {
            if (data['name'] != "") {
                this.hobbys = true
            }
        })
        this.commonService.trailApprentice.map((data: any) => {
            if (data['bis'] != "") {
                this.trailApprentice = true
            }
        })
        this.commonService.references.map((data: any) => {
            if (data['firstName'] != "") {
                this.references = true
            }
        })

        this.commonService.siblings.map((data: any) => {
            if (data['firstname'] != "") {
                this.siblings = true
            }
        })
    }

    onBack() {
        this.router.navigateByUrl('/cv-generator')
    }

    isObjectEmpty(Obj: any) {
        for (var key in Obj) {
            if (Obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    exportToWord() {
        const doc = new Document({
            styles: {
                default: {
                    heading2: {
                        run: {
                            size: 30,
                            bold: true,
                            color: "000000",
                            font: "Calibri"
                        },
                        paragraph: {
                            spacing: {
                                after: 120,
                            },
                        },
                    }
                },
                paragraphStyles: [
                    {
                        id: "paragraphStyle",
                        name: "ParagraphStyle",
                        basedOn: "Normal",
                        next: "Normal",
                        run: {
                            color: "000000",
                            font: "Calibri"
                        }
                    }
                ]
            },
            title: 'lehrstell-lebenslauf',
            sections: [{
                properties: {
                    page: {
                        margin: {
                            top: 700,
                            bottom: 700,
                            left: 700,
                            right: 700
                        }
                    }
                },
                children: [
                    new Paragraph({
                        children: [
                            new ImageRun({
                                data: this.commonService.personalData?.image as string,
                                transformation: {
                                    width: 130,
                                    height: 160,
                                },
                                floating: {
                                    horizontalPosition: {
                                        offset: 5599400,
                                    },
                                    verticalPosition: {
                                        offset: 1111500,
                                    },
                                    wrap: {
                                        type: TextWrappingType.SQUARE,
                                        side: TextWrappingSide.BOTH_SIDES,
                                    },
                                    margins: {
                                        top: 201440,
                                    },
                                },
                            }),
                        ],
                    }),
                    new Paragraph({
                        text: "Lebenslauf",
                        heading: HeadingLevel.HEADING_2
                    }),
                    new Paragraph({
                        style: "paragraphStyle",
                        spacing: {
                            before: 400,
                        },
                        children: [
                            new TextRun({
                                text: 'Vorname',
                                bold: true,
                            }),
                            new TextRun({
                                text: `\t\t${this.commonService.personalData?.firstName}`
                            })
                        ],
                    }),
                    new Paragraph({
                        style: "paragraphStyle",
                        spacing: {
                            before: 100,
                        },
                        children: [
                            new TextRun({
                                text: 'Nachname',
                                bold: true,
                            }),
                            new TextRun({
                                text: `\t\t${this.commonService.personalData?.lastName}`
                            })
                        ],
                    }),
                    new Paragraph({
                        style: "paragraphStyle",
                        spacing: {
                            before: 100,
                        },
                        children: [
                            new TextRun({
                                text: 'Adresse',
                                bold: true,
                            }),
                            new TextRun({
                                text: `\t\t\t${this.commonService.personalData?.street + ' '
                                    + this.commonService.personalData?.number}`
                            })
                        ],
                    }),
                    new Paragraph({
                        style: "paragraphStyle",
                        spacing: {
                            before: 100,
                        },
                        children: [
                            new TextRun({
                                text: `\t\t\t${this.commonService.personalData?.zip + ' '
                                    + this.commonService.personalData?.place}`
                            })
                        ],
                    }),
                    new Paragraph({
                        style: "paragraphStyle",
                        spacing: {
                            before: 100,
                        },
                        children: [
                            new TextRun({
                                text: 'Telefon',
                                bold: true,
                            }),
                            new TextRun({
                                text: `\t\t\t${this.commonService.personalData?.mobile}`
                            })
                        ],
                    }),
                    new Paragraph({
                        style: "paragraphStyle",
                        spacing: {
                            before: 100,
                        },
                        children: [
                            new TextRun({
                                text: 'Email',
                                bold: true,
                            }),
                            new TextRun({
                                text: `\t\t\t${this.commonService.personalData?.email}`
                            })
                        ],
                    }),
                    new Paragraph({
                        style: "paragraphStyle",
                        spacing: {
                            before: 100,
                        },
                        children: [
                            new TextRun({
                                text: 'Geburtsdatum',
                                bold: true,
                            }),
                            new TextRun({
                                text: `\t\t${this.commonService.personalData?.dob ? new DatePipe('de-ch').transform(this.commonService.personalData?.dob, 'dd. MMMM yyyy') : ''}`
                            })
                        ],
                    }),
                    new Paragraph({
                        style: "paragraphStyle",
                        spacing: {
                            before: 100,
                        },
                        children: [
                            new TextRun({
                                text: 'Eltern',
                                bold: true,
                            }),
                            new TextRun({
                                text: `\t\t\t${this.commonService.personalData?.fFirstName + ' ' + this.commonService.personalData?.fLastName}`
                            }),
                            new TextRun({
                                text: `${this.commonService.personalData?.fJob ? ' (' + this.commonService.personalData?.fJob + ')' : ''}`
                            })
                        ],
                    }),
                    new Paragraph({
                        style: "paragraphStyle",
                        spacing: {
                            before: 100,
                        },
                        children: [
                            new TextRun({
                                text: `\t\t\t${this.commonService.personalData?.fFirstName + ' ' + this.commonService.personalData?.fLastName}`
                            }),
                            new TextRun({
                                text: `${this.commonService.personalData?.mJob ? ' (' + this.commonService.personalData?.mJob + ')' : ''}`
                            })
                        ],
                    }),
                    new Paragraph({
                        style: "paragraphStyle",
                        border: {
                            bottom: {
                                color: '808080',
                                space: 400,
                                size: 6,
                                style: BorderStyle.SINGLE
                            },
                        },
                        spacing: {
                            before: 100,
                        },
                        children: [
                            new TextRun({
                                text: 'Geschwister',
                                bold: true,
                            }),
                            new TextRun({
                                text: `\t\t${this.siblingsNamesString != '()' ? this.siblings ? this.siblingsNamesString : 'Keine Geschwister' : ''}`
                            })
                        ],
                    }),
                    new Paragraph({
                        style: "paragraphStyle",
                        spacing: {
                            before: 150,
                        },
                        children: [
                            new TextRun({
                                text: 'Schulbildung',
                                bold: true,
                            })
                        ],
                    }),
                    this.generateSchulbildungParagraph(),
                    new Paragraph({
                        border: {
                            bottom: {
                                color: '808080',
                                space: 100,
                                size: 6,
                                style: BorderStyle.SINGLE
                            },
                        },
                        spacing: {
                            before: 150,
                        }
                    }),

                    new Paragraph({
                        style: "paragraphStyle",
                        spacing: {
                            before: 150,
                        },
                        children: [
                            new TextRun({
                                text: 'Sprachen',
                                bold: true,
                            })
                        ],
                    }),
                    this.generateSprachenParagraph(),
                    new Paragraph({
                        border: {
                            bottom: {
                                color: '808080',
                                space: 100,
                                size: 6,
                                style: BorderStyle.SINGLE
                            },
                        },
                        spacing: {
                            before: 150,
                        }
                    }),

                    new Paragraph({
                        style: "paragraphStyle",
                        spacing: {
                            before: 150,
                        },
                        children: [
                            new TextRun({
                                text: 'Hobbys',
                                bold: true,
                            })
                        ],
                    }),
                    this.generateHobbysParagraph(),
                    new Paragraph({
                        border: {
                            bottom: {
                                color: '808080',
                                space: 100,
                                size: 6,
                                style: BorderStyle.SINGLE
                            },
                        },
                        spacing: {
                            before: 150,
                        }
                    }),

                    new Paragraph({
                        style: "paragraphStyle",
                        spacing: {
                            before: 150,
                        },
                        children: [
                            new TextRun({
                                text: 'Schnupperlehren',
                                bold: true,
                            })
                        ],
                    }),
                    this.generateSchnupperlehrenParagraph(),
                    new Paragraph({
                        border: {
                            bottom: {
                                color: '808080',
                                space: 100,
                                size: 6,
                                style: BorderStyle.SINGLE
                            },
                        },
                        spacing: {
                            before: 150,
                        }
                    }),

                    new Paragraph({
                        style: "paragraphStyle",
                        spacing: {
                            before: 150,
                        },
                        children: [
                            new TextRun({
                                text: `${this.commonService.references.length > 1 ? 'Referenzen' : 'Referenz'}`,
                                bold: true,
                            })
                        ],
                    }),
                    this.generateReferenzenParagraph()
                ],
            }],
        });

        Packer.toBlob(doc).then((blob) => {
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            document.body.appendChild(a);
            a.setAttribute('style', 'display: none');
            a.href = url;
            a.download = 'lehrstell-lebenslauf' + new Date().toUTCString() + '.doc';
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        });
    }

    generateSchulbildungParagraph() : Paragraph {
        let schulbildungParagraph = new Paragraph({
            style: "paragraphStyle",
            spacing: {
                before: 100,
            }
        });
        var br = 0;
        this.commonService.schooling.forEach(school => {
            schulbildungParagraph.addChildElement(new TextRun({
                text: `${school.von } - ${ school.bis }`,
                break: br
            }));
            schulbildungParagraph.addChildElement(new TextRun({
                text: `\t\t${school.schule+', '+school.ort }`
            }));
            br = 1;
        });
        return schulbildungParagraph;
    }

    generateSprachenParagraph(): Paragraph {
        let sprachenParagraph = new Paragraph({
            style: "paragraphStyle",
            spacing: {
                before: 100,
            }
        });
        var br = 0;
        this.commonService.languages.forEach(language => {
            sprachenParagraph.addChildElement(new TextRun({
                text: `${language.language}`,
                break: br
            }));
            sprachenParagraph.addChildElement(new TextRun({
                text: `${language.language?.length <= 8 || language.language == 'Englisch' ? '\t' : ''}\t\t${language.type}`
            }));
            br = 1;
        });
        return sprachenParagraph;
    }

    generateHobbysParagraph(): Paragraph {
        let hobbysParagraph = new Paragraph({
            style: "paragraphStyle",
            spacing: {
                before: 100,
            }
        });
        var br = 0;
        this.commonService.hobbys.forEach(hobby => {
            hobbysParagraph.addChildElement(new TextRun({
                text: `${hobby.name.length > 20 ? hobby.name.substring(0,18): hobby.name}`,
                break: br
            }));
            hobbysParagraph.addChildElement(new TextRun({
                text: `${hobby.name?.length < 8 ? '\t' : ''}\t\t${hobby.description}`
            }));
            br = 1;
        });
        return hobbysParagraph;
    }

    generateSchnupperlehrenParagraph(): Paragraph {
        let schnupperlehrenParagraph = new Paragraph({
            style: "paragraphStyle",
            spacing: {
                before: 100,
            }
        });
        if(this.trailApprentice){
            var br = 0;
            this.commonService.trailApprentice.forEach(trail => {
                schnupperlehrenParagraph.addChildElement(new TextRun({
                    text: `${new DatePipe('en-US').transform(trail.von, 'dd.MM')} - ${new DatePipe('en-US').transform(trail.bis, 'dd.MM.yyyy')}`,
                    break: br
                }));
                schnupperlehrenParagraph.addChildElement(new TextRun({
                    text: `${trail.von ? '' : '\t'}\t${trail.beruf +', '+trail.firma +', '+trail.ort}`
                }));
                br = 1;
            });
        }else{
            schnupperlehrenParagraph.addChildElement(new TextRun({
                text: 'Noch keine Schnupperlehren absolviert'
            }));
        }
       
        return schnupperlehrenParagraph;
    }

    generateReferenzenParagraph(): Paragraph {
        let referenzenParagraph = new Paragraph({
            style: "paragraphStyle",
            spacing: {
                before: 100,
            }
        });
        var br = 0;
        this.commonService.references.forEach(reference => {
            referenzenParagraph.addChildElement(new TextRun({
                text: `${reference?.firstName} ${reference?.lastName} ${reference?.function ? '(' + reference?.function + ')' : ''}`,
                break: br
            }));
            referenzenParagraph.addChildElement(new TextRun({
                text: `Mobile ${reference?.mobile}`,
                break: 1
            }));
            referenzenParagraph.addChildElement(new TextRun({
                text: `${reference?.email}`,
                break: 1
            }));
            referenzenParagraph.addChildElement(new TextRun({
                text: '',
                break: 1
            }));
            br = 1;
        });
        return referenzenParagraph;
    }

}
