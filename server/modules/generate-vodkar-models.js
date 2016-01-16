let models = [
  {
    title: 'Little Ninja',
    imageUrl: '/avatars/default.png',
    price: 0
  },
  {
    title: 'Pretty Death',
    imageUrl: '/avatars/1.png',
    price: 100
  },
  {
    title: 'Pumpskin Boy',
    imageUrl: '/avatars/2.png',
    price: 200
  },
  {
    title: 'Dummy Mummy',
    imageUrl: '/avatars/3.png',
    price: 300
  },
  {
    title: 'Baby Wolf',
    imageUrl: '/avatars/4.png',
    price: 400
  },
  {
    title: 'Dump Ghost',
    imageUrl: '/avatars/5.png',
    price: 500
  },
  {
    title: 'Sir Vampire',
    imageUrl: '/avatars/6.png',
    price: 600
  },
  {
    title: 'White Skeleton',
    imageUrl: '/avatars/7.png',
    price: 700
  },
  {
    title: 'Dr Frankenstein',
    imageUrl: '/avatars/8.png',
    price: 800
  },
  {
    title: 'Friendly Witch',
    imageUrl: '/avatars/9.png',
    price: 900
  }
];

let generateVodkarModels = () => {
  var count = VodkarModel.find().count();
  if (count < models.length) {
    for (var i=count; i< models.length; i++) {
      VodkarModel.insert(models[i]);
    }
  }
};


Modules.server.generateVodkarModels = generateVodkarModels;
