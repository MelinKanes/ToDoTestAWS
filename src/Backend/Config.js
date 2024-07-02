import AWS from 'aws-sdk';

export default function configureAWS() {
  //Just Uncomment the variables to make this work
  //const AssessKey = "AKIA2UC3FHGRHHPS4C4H";
  //const SAccessKey = "MG1T9l83pP44phUgO8/EUyjWkE5ya1dduFrqdL4v";
  //cont Region = 'eu-north-1'
  AWS.config.update({
    region: Region,
    credentials: {
      accessKeyId: AssessKey,
      secretAccessKey: SAccessKey,
    },
  });
}
